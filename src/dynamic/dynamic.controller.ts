import { Get, Controller, Param, Request, Response } from '@nestjs/common';
import RequestEntityFactory from '../factory/requestentityfactory';
import { DynamicService } from './dynamic.service';

/**
 * dynamically allocated endpoints that reroute from RAW
 */
@Controller('((:version([0-9]+).:patch([0-9]+).:fix([0-9]+))|latest)')
export class DynamicController {
  constructor(private dynamicService: DynamicService) {}
  
  /**
   * gets a dynamically generated route
   * 
   * @param params 
   * @param req 
   * @param res 
   */
  @Get(':route(*)')
  async getFile(@Param() params, @Request() req, @Response() res) {
    const reqEntityFactory = new RequestEntityFactory();
    const reqEntity = await reqEntityFactory.produceEntity(params.route, req.patch);
    const URLs =  await this.dynamicService.filterCDNEntities(reqEntity);
    this.dynamicService.pipeFile(URLs, res);
  }
}
