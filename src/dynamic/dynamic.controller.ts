import { Get, Controller, Param, Request, Response, HttpException, HttpStatus } from '@nestjs/common';
import RequestEntityFactory from '../factory/requestentityfactory';
import Patch from '../entity/patch';
import { DynamicService } from './dynamic.service';
import { Urls } from '../entity/urls';


@Controller('((:version([0-9]+).:patch([0-9]+).:fix([0-9]+))|latest)')
export class DynamicController {
  constructor(private dynamicService: DynamicService) {}
  
  @Get(':route(*)')
  async getFile(@Param() params, @Request() req, @Response() res) {
    const reqEntityFactory = new RequestEntityFactory();
    const reqEntity = await reqEntityFactory.produceEntity(params.route, req.patch);
    const URLs =  await this.dynamicService.filterCDNEntities(reqEntity);
    this.dynamicService.pipeFile(URLs, res);
  }
}
