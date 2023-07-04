import { Injectable } from '@nestjs/common'
import { HtmlOptions, taraskSync } from '@core'

@Injectable()
export class AppService {
  convert(text: string, abc: number, j: number, html: false | HtmlOptions = false): string {
    return taraskSync(text, { abc, j, html })
  }
}
