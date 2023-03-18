import { Injectable } from '@nestjs/common';
import { toTaraskConvert } from './scripts/tarask';

@Injectable()
export class AppService {
  convert(text, abc, j): string {
    return toTaraskConvert(text, false, { abc, j });
  }
}
