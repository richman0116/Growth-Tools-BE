/* istanbul ignore file */
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  health(): string {
    return 'The girs api version 1.0.0';
  }
}
