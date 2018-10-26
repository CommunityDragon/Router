import { Module } from '@nestjs/common';
import { PatchService } from './patch.service';
import { PatchController } from './patch.controller';

@Module({
  controllers: [PatchController],
  providers: [PatchService],
})

export class PatchModule {}
