import { Injectable } from '@nestjs/common';
import { toTaraskConvert } from './scripts/tarask';

@Injectable()
export class AppService {
  convert(text: string, abc: number, j: number): string {
    return toTaraskConvert(text, false, { abc, j });
  }
}
