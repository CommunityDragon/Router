import { Module, NestModule, MiddlewaresConsumer } from '@nestjs/common';
import { ChampionController } from './champion.controller';
import { ChampionService } from './champion.service';
import { PatchService } from '../patch/patch.service';
import { PatchCheckerMiddleware } from '../common/middleware/patchchecker.middleware';

@Module({
  controllers: [ChampionController],
  components: [ChampionService, PatchService],
})
export class ChampionModule implements NestModule {
  configure(consumer: MiddlewaresConsumer): void | MiddlewaresConsumer {
    consumer.apply(PatchCheckerMiddleware)
      .with('ddragon')
      .forRoutes(ChampionController);
  }
}
