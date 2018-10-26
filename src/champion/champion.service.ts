import { Injectable } from '@nestjs/common';
import CDragon from '../entity/cdragon';
import Patch from '../entity/patch';

const cdragon = CDragon.getInstance();

@Injectable()
export class ChampionService {

  /**
   * gets the champions of given patch.
   * 
   * @param patch 
   */
  async getChampions(patch: Patch): Promise<any> {
    let champions = await cdragon.getChampions(patch);
    return champions;
  }
}