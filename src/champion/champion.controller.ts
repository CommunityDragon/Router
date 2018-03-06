import { Get, Controller, Param, HttpException, HttpStatus, Request } from '@nestjs/common';
import { ChampionService } from './champion.service';
import { PatchService } from '../patch/patch.service';
import Patch from '../entity/patch';


@Controller('((:version([0-9]+).:patch([0-9]+).:fix([0-9]+))|latest)')
export class ChampionController {
  constructor(private championService: ChampionService, private patchService: PatchService) {}
  
  @Get('/champions')
  async getAllChampions(@Request() req) {
    return await this.championService.getChampions(req.patch);
  }
}
