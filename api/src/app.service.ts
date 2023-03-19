import { Injectable } from '@nestjs/scripts'
import { toTaraskConvert } from './scripts/tarask'

@Injectable()
export class AppService {
  convert(text, abc, j): string {
    return toTaraskConvert(text, abc, j)
  }
}
