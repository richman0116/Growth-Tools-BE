/* istanbul ignore file */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { IJwtPayload } from '../payloads/jwt-payload.payload';
import { JwtConfig } from '../../../configs/configs.constants';
import { UserService } from '../../user/user.service';
import {
  TypeStatus,
  StatusCode,
  LanguageCode,
} from '../../../common/common.constants';
import { LanguageService } from '../../../modules/language/language.service';
import { RedisService } from '../../../modules/redis/redis.service';

@Injectable()
export class VerifyStrategy extends PassportStrategy(Strategy, 'verify') {
  constructor(
    private readonly usersService: UserService,
    private readonly languageService: LanguageService,
    private readonly redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JwtConfig.COMMON_API_JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: IJwtPayload): Promise<IJwtPayload> {
    const { _id, deviceId } = payload;
    const checkLogout = await this.redisService.hGet(
      `access-token-${_id.toString()}`,
      deviceId,
    );
    if (!checkLogout) {
      throw new HttpException(
        await this.usersService.formatOutputData(
          {
            lang: LanguageCode.United_States,
            key: 'translate.UNAUTHORIZED',
          },
          { data: null, statusCode: StatusCode.UNAUTHORIZED },
        ),
        HttpStatus.UNAUTHORIZED,
      );
    }
    const user = await this.usersService.findOneById(_id);
    if (!user) {
      throw new HttpException(
        await this.usersService.formatOutputData(
          {
            lang: LanguageCode.United_States,
            key: 'translate.USER_NOT_FOUND',
          },
          { data: null, statusCode: StatusCode.USER_NOT_FOUND },
        ),
        HttpStatus.NOT_FOUND,
      );
    }
    if (
      user.lastUpdatePassword &&
      user.lastUpdatePassword.getTime() !==
        new Date(payload?.lastUpdatePassword).getTime()
    ) {
      throw new HttpException(
        await this.usersService.formatOutputData(
          {
            lang: LanguageCode.United_States,
            key: 'translate.USER_FORCE_LOGOUT_STATUS',
          },
          {
            data: null,
            statusCode: StatusCode.USER_FORCE_LOGOUT_STATUS,
          },
        ),
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (user.status !== TypeStatus.ACTIVE) {
      throw new HttpException(
        await this.usersService.formatOutputData(
          {
            lang: LanguageCode.United_States,
            key: 'translate.YOUR_ACCOUNT_IS_DEACTIVATED',
          },
          { data: null, statusCode: StatusCode.USER_FORCE_LOGOUT_STATUS },
        ),
        HttpStatus.FORBIDDEN,
      );
    }
    payload.language = LanguageCode.United_States;

    return payload;
  }
}
