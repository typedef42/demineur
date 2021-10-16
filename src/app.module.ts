import { Module } from '@nestjs/common';

import { GameModule } from './module/game/game.module';

@Module({
  imports: [GameModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
