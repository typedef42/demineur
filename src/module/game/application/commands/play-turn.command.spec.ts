import { Test } from '@nestjs/testing';

import {
  FieldRepositoryProvider,
  FIELD_REPOSITORY,
} from '../../infrastructure/store/field/field.repository.provider';
import { InMemFieldRepository } from '../../infrastructure/store/field/in-mem/in-mem-field.repository';
import { PlayTurnCommand, PlayTurnCommandHandler } from './play-turn.command';
import {
  StartGameCommand,
  StartGameCommandHandler,
} from './start-game.command';

describe('StartGameCommand', () => {
  let repository: InMemFieldRepository;
  let startGameHandler: StartGameCommandHandler;
  let handler: PlayTurnCommandHandler;

  beforeAll(async () => {
    const testModule = await Test.createTestingModule({
      providers: [
        FieldRepositoryProvider,
        StartGameCommandHandler,
        PlayTurnCommandHandler,
      ],
    }).compile();

    repository = testModule.get(FIELD_REPOSITORY);
    startGameHandler = testModule.get(StartGameCommandHandler);
    handler = testModule.get(PlayTurnCommandHandler);
  });

  afterEach(() => {
    repository.clear();
  });

  describe('Given a set of player turn parameters...', () => {
    it('should reveal all the 0 neighbours bombs cells when player trigger such a cell', async () => {
      await startGameHandler.execute(new StartGameCommand(2, 2, 0));
      const { field, gameOver } = await handler.execute(
        new PlayTurnCommand(0, 0),
      );

      expect(gameOver).toBeFalsy();

      expect(field.getData()).toEqual([
        expect.objectContaining({
          isBomb: false,
          revealed: true,
          nearBombs: 0,
        }),
        expect.objectContaining({
          isBomb: false,
          revealed: true,
          nearBombs: 0,
        }),
        expect.objectContaining({
          isBomb: false,
          revealed: true,
          nearBombs: 0,
        }),
        expect.objectContaining({
          isBomb: false,
          revealed: true,
          nearBombs: 0,
        }),
      ]);
    });

    it('should reveal the entire field when trigger a bomb', async () => {
      await startGameHandler.execute(new StartGameCommand(2, 2, 4));
      const { field, gameOver } = await handler.execute(
        new PlayTurnCommand(0, 0),
      );

      expect(gameOver).toBeTruthy();

      expect(field.getData()).toEqual([
        expect.objectContaining({
          isBomb: true,
          revealed: true,
        }),
        expect.objectContaining({
          isBomb: true,
          revealed: true,
        }),
        expect.objectContaining({
          isBomb: true,
          revealed: true,
        }),
        expect.objectContaining({
          isBomb: true,
          revealed: true,
        }),
      ]);
    });
  });
});
