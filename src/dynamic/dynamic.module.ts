import { Module, MiddlewaresConsumer, NestModule } from '@nestjs/common';
import { DynamicController } from './dynamic.controller';
import { PatchService } from '../patch/patch.service';
import { PatchCheckerMiddleware } from '../common/middleware/patchchecker.middleware';
import { DynamicService } from './dynamic.service';

/**
 * handles endpoints that redirect to raw
 */
@Module({
  controllers: [DynamicController],
  components: [PatchService, DynamicService]
})
export class DynamicModule implements NestModule {
  configure(consumer: MiddlewaresConsumer): void | MiddlewaresConsumer {
    consumer.apply(PatchCheckerMiddleware)
      .with('ddragon')
      .forRoutes(DynamicController);
  }
}
