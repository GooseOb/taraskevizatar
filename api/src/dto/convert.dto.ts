import { TaraskOptions } from 'taraskevizer'

export class ConvertDto {
  text: string
  alphabet: TaraskOptions['abc']
  alwaysJ: TaraskOptions['j']
  html: TaraskOptions['html']
  nonHtml: TaraskOptions['nonHtml']
}
