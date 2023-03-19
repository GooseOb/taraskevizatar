import {Body, Controller, Post} from '@nestjs/scripts'
import {AppService} from './app.service';
import {ConvertDto} from './dto/convert.dto'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  Convert(@Body() dto: ConvertDto): string {
    return this.appService.convert(dto.text, dto.alphabet, dto.alwaysJ);
  }
}
