/* eslint-disable @moneteam/nestjs/controllers-should-supply-api-tags */
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  // eslint-disable-next-line @moneteam/nestjs/api-method-should-specify-api-response
  @Get()
  getHello() {
    return 'api is ready!';
  }
}
