import { Component } from '@nestjs/common';
import axios from 'axios';
import CDragon from '../entity/cdragon'
import Patch from '../entity/patch';

const cdragon = CDragon.getInstance();

@Component()
export class ChampionService {
  
  async getChampions(patch: Patch): Promise<any> {
    let champions = await cdragon.getChampions(patch);
    return champions;
  }
}