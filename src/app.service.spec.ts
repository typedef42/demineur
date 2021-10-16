import { AppService } from './app.service';

describe('app.service', () => {
  let service: AppService;

  beforeAll(() => {
    service = new AppService();
  });

  afterEach(() => {
    service.clearGame();
  });

  describe('Given a set of game parameters...', () => {
    it('should generate a field of the right size', async () => {
      const field = await service.startGame(2, 2, 0);

      expect(field.length).toEqual(4);
    });

    it('should generate the correct amount of bombs', async () => {
      const field = await service.startGame(2, 2, 2);

      expect(field.filter((cell) => cell.isBomb).length).toEqual(2);
    });

    it('should resolve for each cell the number of neighbours bombs', async () => {
      const field = await service.startGame(2, 2, 2);

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
    it('should resolve for each cell the number of neighbours bombs', async () => {
      const field = await service.startGame(2, 2, 1);

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

    it('should resolve for each cell the number of neighbours bombs', async () => {
      const field = await service.startGame(2, 2, 3);

      expect(field.filter((cell) => !cell.isBomb)).toEqual([
        expect.objectContaining({
          isBomb: false,
          nearBombs: 3,
        }),
      ]);
    });

    it('should resolve for each cell the number of neighbours bombs', async () => {
      const field = await service.startGame(2, 2, 0);

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

  describe('Given a set of player turn parameters...', () => {
    it('should reveal all the 0 neighbours bombs cells when player trigger such a cell', async () => {
      await service.startGame(2, 2, 0);
      const { field } = await service.playTurn(0, 0);

      expect(field).toEqual([
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
      await service.startGame(2, 2, 4);
      const { field } = await service.playTurn(0, 0);

      expect(field).toEqual([
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
