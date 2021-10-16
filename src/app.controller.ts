import { Body, Controller, Post } from '@nestjs/common';
import { pick } from 'lodash';

import { AppService } from './app.service';
import { GameParamsInDTO } from './dto/game.input.dto';
import { GameCellOutDTO } from './dto/game.out.dto';
import { TurnParamsInDTO } from './dto/turn.in.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/start-game')
  async startGame(
    @Body() gameParams: GameParamsInDTO,
  ): Promise<Array<GameCellOutDTO>> {
    const field = await this.appService.startGame(
      gameParams.columns,
      gameParams.rows,
      gameParams.bombs,
    );

    return field.map((cell) =>
      cell.revealed ? { ...cell } : { revealed: false },
    );
  }

  @Post('/play-turn')
  async playTurn(
    @Body() turnParams: TurnParamsInDTO,
  ): Promise<Array<GameCellOutDTO>> {
    const { x, y } = turnParams;
    const { field } = await this.appService.playTurn(x, y);

    return field.map((cell) =>
      cell.revealed
        ? { ...pick(cell, ['revealed', 'isBomb', 'nearBombs']) }
        : { revealed: false },
    );
  }
}
