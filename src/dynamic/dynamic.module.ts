import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { DynamicController } from './dynamic.controller';
import { PatchService } from '../patch/patch.service';
import { PatchCheckerMiddleware } from '../common/middleware/patchchecker.middleware';
import { DynamicService } from './dynamic.service';

/**
 * handles endpoints that redirect to raw
 */
@Module({
  controllers: [DynamicController],
  providers: [PatchService, DynamicService],
})
export class DynamicModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void | MiddlewareConsumer {
    consumer.apply(PatchCheckerMiddleware)
      .with('ddragon')
      .forRoutes(DynamicController);
  }
}
