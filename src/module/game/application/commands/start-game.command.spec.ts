import { Test } from '@nestjs/testing';

import {
  FieldRepositoryProvider,
  FIELD_REPOSITORY,
} from '../../infrastructure/store/field/field.repository.provider';
import { InMemFieldRepository } from '../../infrastructure/store/field/in-mem/in-mem-field.repository';
import {
  StartGameCommand,
  StartGameCommandHandler,
} from './start-game.command';

describe('StartGameCommand', () => {
  let repository: InMemFieldRepository;
  let handler: StartGameCommandHandler;

  beforeAll(async () => {
    const testModule = await Test.createTestingModule({
      providers: [FieldRepositoryProvider, StartGameCommandHandler],
    }).compile();

    repository = testModule.get(FIELD_REPOSITORY);
    handler = testModule.get(StartGameCommandHandler);
  });

  afterEach(() => {
    repository.clear();
  });

  describe('Given a set of game parameters...', () => {
    it('should generate a field of the right size', async () => {
      const field = await handler.execute(new StartGameCommand(2, 2, 0));

      expect(field.length()).toEqual(4);
    });

    it('should generate the correct amount of bombs', async () => {
      const field = (
        await handler.execute(new StartGameCommand(2, 2, 2))
      ).getData();

      expect(field.filter((cell) => cell.isBomb).length).toEqual(2);
    });

    it('should resolve for each cell the number of neighbours bombs (when 2 bombs)', async () => {
      const field = (
        await handler.execute(new StartGameCommand(2, 2, 2))
      ).getData();

      expect(field.filter((cell) => !cell.isBomb)).toEqual([
        expect.objectContaining({
          isBomb: false,
          nearBombs: 2,
        }),
        expect.objectContaining({
          isBomb: false,
          nearBombs: 2,
        }),
      ]);
    });

    // 0 1
    // 0 0
    it('should resolve for each cell the number of neighbours bombs (when 1 bomb)', async () => {
      const field = (
        await handler.execute(new StartGameCommand(2, 2, 1))
      ).getData();

      expect(field.filter((cell) => !cell.isBomb)).toEqual([
        expect.objectContaining({
          isBomb: false,
          nearBombs: 1,
        }),
        expect.objectContaining({
          isBomb: false,
          nearBombs: 1,
        }),
        expect.objectContaining({
          isBomb: false,
          nearBombs: 1,
        }),
      ]);
    });

    it('should resolve for each cell the number of neighbours bombs (when 3 bombs)', async () => {
      const field = (
        await handler.execute(new StartGameCommand(2, 2, 3))
      ).getData();

      expect(field.filter((cell) => !cell.isBomb)).toEqual([
        expect.objectContaining({
          isBomb: false,
          nearBombs: 3,
        }),
      ]);
    });

    it('should resolve for each cell the number of neighbours bombs (when no bombs)', async () => {
      const field = (
        await handler.execute(new StartGameCommand(2, 2, 0))
      ).getData();

      expect(field.filter((cell) => !cell.isBomb)).toEqual([
        expect.objectContaining({
          isBomb: false,
          nearBombs: 0,
        }),
        expect.objectContaining({
          isBomb: false,
          nearBombs: 0,
        }),
        expect.objectContaining({
          isBomb: false,
          nearBombs: 0,
        }),
        expect.objectContaining({
          isBomb: false,
          nearBombs: 0,
        }),
      ]);
    });
  });
});
