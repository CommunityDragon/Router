import { Injectable } from '@nestjs/common';
import DDragon from '../entity/ddragon';
import Patch from '../entity/patch';

const ddragon = DDragon.getInstance();

@Injectable()
export class PatchService {

  async verifyPatch(patch: Patch): Promise<boolean> {
    return ((await this.getPatches()).indexOf(patch.getDDragonPatch()) !== -1);
  }

  async getPatches(): Promise<string[]> {
    const patches = await ddragon.getPatches();

    return patches.filter((patch) => {
      const splitPatch = patch.split('.');
      return patch.startsWith('lolpatch') ? false
      : splitPatch.length !== 3 ? false
      : parseInt(splitPatch[0], 0) < 7 ? false : true;
    });
  }
}
