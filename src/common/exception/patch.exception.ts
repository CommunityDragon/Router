import { NotFoundException } from '@nestjs/common';

export class InvalidPatchException extends NotFoundException {
  constructor(patchString: string) {
    super(`Patch '${patchString}' does not exist`);
  }
}
