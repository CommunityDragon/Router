import { Middleware, NestMiddleware, ExpressMiddleware } from '@nestjs/common';
import Patch from '../../entity/patch';
import { PatchService } from '../../patch/patch.service';
import { InvalidPatchException } from '../exception/patch.exception';

@Middleware()
export class PatchCheckerMiddleware implements NestMiddleware {
  constructor(private patchService: PatchService) {}
  
  async resolve(patchType: string): Promise<ExpressMiddleware> {
    return async (req, res, next) => {
      const { version, patch, fix, route } = req.params;
      let patchString: string;
      let lolPatch: Patch;
      
      /** Validate patch */
      if (req.url.startsWith('/latest')) {
        patchString = (await this.patchService.getPatches())[0];
      } else {
        patchString = `${version}.${patch}.${fix}`;
      }
      
      lolPatch = new Patch({ type: patchType, value: patchString });
      
      if (!await this.patchService.verifyPatch(lolPatch)) {
        throw new InvalidPatchException(patchString);
      } else {
        req.patch = lolPatch;
        next();
      }
    };
  }
}