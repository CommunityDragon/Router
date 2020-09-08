import { NestMiddleware, MiddlewareFunction, Injectable } from '@nestjs/common';
import Patch from '../../entity/patch';
import { PatchService } from '../../patch/patch.service';
import { InvalidPatchException } from '../exception/patch.exception';

@Injectable()
export class PatchCheckerMiddleware implements NestMiddleware {
  private cdragonPatches: string[] = [];
  private timer: NodeJS.Timeout;

  constructor(private patchService: PatchService) {}

  async resolve(patchType: string): Promise<MiddlewareFunction> {
    return async (req, res, next) => {
      const { version, patch, fix, route } = req.params;
      let patchString: string;
      let lolPatch: Patch;

      if (!this.timer) {
        this.timer = setInterval(() => {
          Patch.fetchCDragonPatches().then(patches => this.cdragonPatches = patches)
        }, 3600 * 12)
      }

      if (this.cdragonPatches.length == 0) {
        this.cdragonPatches = await Patch.fetchCDragonPatches()
      }

      /** Validate patch */
      if (req.url.startsWith('/latest')) {
        patchString = this.cdragonPatches[0];
      } else {
        patchString = `${version}.${patch}`;
        if (this.cdragonPatches.indexOf(patchString) < 0) {
          throw new InvalidPatchException(patchString);
        }
      }

      lolPatch = new Patch({ type: 'cdragon', value: patchString });
      await lolPatch.setPatches([...this.cdragonPatches]);

      req.patch = lolPatch;
      next();
    };
  }
}