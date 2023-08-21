import { Injectable } from '@nestjs/common'
import { TaraskOptions, taraskSync } from 'taraskevizer'

@Injectable()
export class AppService {
  convert(
    text: string,
    abc: TaraskOptions['abc'],
    j: TaraskOptions['j'],
    html: TaraskOptions['html'],
    nonHtml: TaraskOptions['nonHtml'],
  ): string {
    return taraskSync(text, { abc, j, html, nonHtml })
  }
}
