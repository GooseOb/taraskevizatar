import { Injectable } from '@nestjs/common'
import { taraskSync } from '@scripts'

@Injectable()
export class AppService {
  convert(text: string, abc: number, j: number, html = false): string {
    return taraskSync(text, html, { abc, j })
  }
}
