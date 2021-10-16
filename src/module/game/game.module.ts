import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { PlayTurnCommandHandler } from './application/commands/play-turn.command';
import { StartGameCommandHandler } from './application/commands/start-game.command';
import { FieldRepositoryProvider } from './infrastructure/store/field/field.repository.provider';
import { GameController } from './infrastructure/web/game.controller';

const repositories = [FieldRepositoryProvider];
const commands = [StartGameCommandHandler, PlayTurnCommandHandler];

@Module({
  imports: [CqrsModule],
  controllers: [GameController],
  providers: [...repositories, ...commands],
})
export class GameModule {}
