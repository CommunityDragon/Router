import { Get, Controller, Request } from '@nestjs/common';
import { ChampionService } from './champion.service';

/**
 * provides champion info
 */
@Controller('((:version([0-9]+).:patch([0-9]+).:fix([0-9]+))|latest)')
export class ChampionController {
  constructor(private championService: ChampionService) {}

  /**
   * gets an array of champion data.
   *
   * @param req
   */
  @Get('/champions')
  async getAllChampions(@Request() req) {
    return await this.championService.getChampions(req.patch);
  }
}
