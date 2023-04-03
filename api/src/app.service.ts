import { Injectable } from '@nestjs/common';
import { taraskSync } from '../../scripts/tarask';

@Injectable()
export class AppService {
  convert(text: string, abc: number, j: number): string {
    return taraskSync(text, false, { abc, j });
  }
}
