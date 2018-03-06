import { Component } from '@nestjs/common';
import axios from 'axios';
import DDragon from '../entity/ddragon'
import Patch from '../entity/patch';

const ddragon = DDragon.getInstance();

@Component()
export class PatchService {
  
  async verifyPatch(patch: Patch): Promise<boolean> {
    return ((await this.getPatches()).indexOf(patch.getDDragonPatch()) != -1)
  }
  
  async getPatches(): Promise<string[]> {
    let patches = await ddragon.getPatches();
    
    return patches.filter((patch) => {
      let splitPatch = patch.split('.');
      return patch.startsWith('lolpatch') ? false 
      : splitPatch.length != 3 ? false 
      : parseInt(splitPatch[0]) < 7 ? false : true
    });
  }
}