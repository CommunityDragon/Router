import { Module } from '@nestjs/common';
import { PatchModule } from './patch/patch.module';
import { DynamicModule } from './dynamic/dynamic.module';
import { ChampionModule } from './champion/champion.module';
import { RouteModule } from './route/route.module';
import { HomeModule } from './home/home.module';


@Module({
  imports: [
    ChampionModule,
    DynamicModule,
    PatchModule,
    RouteModule,
    HomeModule,
  ],
  controllers: [],
  components: [],
})

export class ApplicationModule {}
