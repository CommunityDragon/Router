import { Component } from '@nestjs/common';
import axios from 'axios';
import CDragon from '../entity/cdragon'
import Patch from '../entity/patch';

const cdragon = CDragon.getInstance();

@Component()
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