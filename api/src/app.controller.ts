import { Body, Controller, Post } from '@nestjs/common'
import { AppService } from './app.service'
import { ConvertDto } from './dto/convert.dto'
import { TaraskOptions } from 'taraskevizer'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  Convert(@Body() dto: ConvertDto): string {
    return this.appService.convert(
      dto.text,
      dto.alphabet as TaraskOptions['abc'],
      dto.alwaysJ as TaraskOptions['j'],
      dto?.html,
      dto?.nonHtml,
    )
  }
}
