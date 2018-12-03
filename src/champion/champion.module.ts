import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ChampionController } from './champion.controller';
import { ChampionService } from './champion.service';
import { PatchService } from '../patch/patch.service';
import { PatchCheckerMiddleware } from '../common/middleware/patchchecker.middleware';

/**
 * handles champion requests
 */
@Module({
  controllers: [ChampionController],
  providers: [ChampionService, PatchService],
})
export class ChampionModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void | MiddlewareConsumer {
    consumer.apply(PatchCheckerMiddleware)
      .with('ddragon')
      .forRoutes(ChampionController);
  }
}
