import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { I18nService } from 'nestjs-i18n';
import { LanguageCode, StatusCode } from '../../common/common.constants';
import { BaseAbstractService } from '../../base/base.abstract.service';
import { JwtConfig } from '../../configs/configs.constants';
import { UserService } from '../user/user.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { IJwtPayload, IJwtRefreshToken } from './payloads/jwt-payload.payload';
import { LanguageService } from '../language/language.service';
import * as _ from 'lodash';

@Injectable()
export class TokenService extends BaseAbstractService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly languageService: LanguageService,
    i18nService: I18nService,
  ) {
    super(i18nService);
  }

  async createTokenLogin(userId: string, deviceId: string) {
    const userInfo = await this.userService.getUserInformationById(userId);
    const permissions = _.union(
      ...userInfo.userRoles.map((role) => role.role.permissions),
    );
    const accessTokenPayload: IJwtPayload = {
      id: userInfo.id,
      email: userInfo.email,
      phone: userInfo.phone,
      permissions,
      lastUpdatePassword: userInfo.lastUpdatePassword,
      deviceId,
    };
    const refreshTokenPayload: IJwtRefreshToken = {
      id: userInfo.id,
      deviceId: deviceId,
      language: LanguageCode.United_States,
      lastUpdatePassword: userInfo.lastUpdatePassword,
    };
    const accessTokenOptions: JwtSignOptions = {
      expiresIn: JwtConfig.COMMON_API_JWT_EXPIRES_IN,
      secret: JwtConfig.COMMON_API_JWT_SECRET,
    };
    const refreshTokenOptions: JwtSignOptions = {
      expiresIn: JwtConfig.COMMON_API_JWT_REFRESH_TOKEN_EXPIRES_IN,
      secret: JwtConfig.COMMON_API_JWT_REFRESH_TOKEN_SECRET,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessTokenPayload, accessTokenOptions),
      this.jwtService.signAsync(refreshTokenPayload, refreshTokenOptions),
    ]);
    userInfo.language = LanguageCode.United_States;
    return {
      user: userInfo,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(
    payload: IJwtRefreshToken,
    refreshTokenDto: RefreshTokenDto,
  ) {
    const { deviceId } = refreshTokenDto;
    if (deviceId !== payload.deviceId) {
      throw new HttpException(
        await this.formatOutputData(
          {
            lang: LanguageCode.United_States,
            key: 'translate.UNAUTHORIZED',
          },
          { data: null, statusCode: StatusCode.UNAUTHORIZED },
        ),
        HttpStatus.UNAUTHORIZED,
      );
    }
    const userInfo = await this.userService.getUserInformationById(payload.id);
    const permissions = _.union(
      ...userInfo.userRoles.map((role) => role.role.permissions),
    );
    const accessTokenPayload: IJwtPayload = {
      id: userInfo.id,
      email: userInfo.email,
      phone: userInfo.phone,
      permissions,
      deviceId,
      lastUpdatePassword: userInfo.lastUpdatePassword,
    };

    const accessTokenOptions: JwtSignOptions = {
      expiresIn: JwtConfig.COMMON_API_JWT_EXPIRES_IN,
      secret: JwtConfig.COMMON_API_JWT_SECRET,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessTokenPayload, accessTokenOptions),
      '',
      //   this.redisService.hGet(
      //     `refresh-token-${payload._id.toString()}`,
      //     deviceId,
      //   ),
    ]);
    // await this.redisService.hSet(
    //   `access-token-${accessTokenPayload._id}`,
    //   deviceId,
    //   accessToken,
    // );
    return {
      user: userInfo,
      accessToken,
      refreshToken,
    };
  }
}
