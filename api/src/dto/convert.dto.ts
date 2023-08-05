import { HtmlOptions } from 'taraskevizer'

export class ConvertDto {
  text: string
  alphabet: number
  alwaysJ: number
  html?: false | HtmlOptions
}
