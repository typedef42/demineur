import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { pick } from 'lodash';
import { PlayTurnCommand } from '../../application/commands/play-turn.command';

import { StartGameCommand } from '../../application/commands/start-game.command';
import { Field } from '../../domain/entity/field.entity';
import { GameParamsInDTO } from './dto/game.input.dto';
import { GameCellOutDTO } from './dto/game.out.dto';
import { TurnParamsInDTO } from './dto/turn.in.dto';

@Controller()
export class GameController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('/start-game')
  async startGame(
    @Body() gameParams: GameParamsInDTO,
  ): Promise<Array<GameCellOutDTO>> {
    try {
      const field: Field = await this.commandBus.execute(
        new StartGameCommand(
          gameParams.columns,
          gameParams.rows,
          gameParams.bombs,
        ),
      );

      return field
        .getData()
        .map((cell) => (cell.revealed ? { ...cell } : { revealed: false }));
    } catch (err) {
      console.error(`Cannot start game: ${err.message}`);
      throw new BadRequestException(err);
    }
  }

  @Post('/play-turn')
  async playTurn(
    @Body() turnParams: TurnParamsInDTO,
  ): Promise<Array<GameCellOutDTO>> {
    const { x, y } = turnParams;

    try {
      const { field }: { field: Field; gameOver: boolean } =
        await this.commandBus.execute(new PlayTurnCommand(x, y));

      return field
        .getData()
        .map((cell) =>
          cell.revealed
            ? { ...pick(cell, ['revealed', 'isBomb', 'nearBombs']) }
            : { revealed: false },
        );
    } catch (err) {
      console.error(`Cannot play turn: ${err.message}`);
      throw new BadRequestException(err);
    }
  }
}
