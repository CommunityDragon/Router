import { Get, Controller } from '@nestjs/common';
import { PatchService } from './patch.service';

@Controller()
export class PatchController {
  constructor(private patchService: PatchService) {}

  @Get('/patches')
  async getAllPatches() {
    return await this.patchService.getPatches();
  }
}
