import { Injectable } from '@nestjs/common';
import { toTarask } from '../../scripts';

@Injectable()
export class AppService {
  convert(text: string, abc: number, j: number): string {
    return toTarask(text, false, { abc, j });
  }
}
