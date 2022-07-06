/* eslint-disable @moneteam/nestjs/controllers-should-supply-api-tags */
import { Controller, Get } from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller()
export class AppController {
  // eslint-disable-next-line @moneteam/nestjs/api-method-should-specify-api-response
  @Get()
  getHello(@I18n() i18n: I18nContext) {
    return i18n.t('admin.name');
  }
}
