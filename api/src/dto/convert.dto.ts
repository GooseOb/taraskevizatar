import { HtmlOptions } from '@core';

export class ConvertDto {
  text: string
  alphabet: number
  alwaysJ: number
  html?: false | HtmlOptions
}
