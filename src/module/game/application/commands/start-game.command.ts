import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Cell } from '../../domain/entity/cell.entity';
import { FieldRepository } from '../../domain/store/field.repository';
import { FIELD_REPOSITORY } from '../../infrastructure/store/field/field.repository.provider';

export class StartGameCommand {
  constructor(
    public readonly columns: number,
    public readonly rows: number,
    public readonly bombs: number,
  ) {}
}

/**
 * This use-case have to be executed to start a game.
 * It will have the effect of :
 * - initializing a new game field of specified dimenssions
 * - have the requiered bombs amount randomly placed in the field
 * - have the field nearest count pre-resolved
 */
@CommandHandler(StartGameCommand)
export class StartGameCommandHandler
  implements ICommandHandler<StartGameCommand>
{
  private columns: number;
  private rows: number;

  constructor(
    @Inject(FIELD_REPOSITORY) private readonly fieldRepository: FieldRepository,
  ) {}

  async execute({ columns, rows, bombs }: StartGameCommand) {
    await this.initField(columns, rows);
    await this.placeBombs(bombs);
    await this.resolve();

    return this.fieldRepository.get();
  }

  private resolve() {
    const field = this.fieldRepository.get();

    for (let i = 0; i < field.length(); i++) {
      const neighbours: Array<Cell> = this.getNeighbours(i);

      field.getCell1D(i).nearBombs = neighbours.reduce(
        (bombsCount, currentCell) => {
          return (bombsCount += currentCell.isBomb ? 1 : 0);
        },
        0,
      );
    }
  }

  private getNeighbours(index: number): Array<Cell> {
    const field = this.fieldRepository.get();
    const x = index % this.rows;
    const y = Math.floor(index / this.rows);
    let neighbours = [];

    // prettier-ignore
    neighbours.push(x === this.columns - 1 ? undefined : field.getCell1D(index + 1));
    // prettier-ignore
    neighbours.push(x === 0 ? undefined : field.getCell1D(index - 1));
    // prettier-ignore
    neighbours.push(y === 0 ? undefined : (x === this.columns - 1 ? undefined : field.getCell2D(x + 1, y - 1)));
    // prettier-ignore
    neighbours.push(y === 0 ? undefined : field.getCell2D(x, y - 1));
    // prettier-ignore
    neighbours.push(y === 0 ? undefined : (x === 0 ? undefined : field.getCell2D(x - 1, y - 1)));
    // prettier-ignore
    neighbours.push(y === this.rows - 1 ? undefined : (x === this.columns - 1 ? undefined : field.getCell2D(x + 1, y + 1)));
    // prettier-ignore
    neighbours.push(y === this.rows - 1 ? undefined : field.getCell2D(x, y + 1));
    // prettier-ignore
    neighbours.push(y === this.rows - 1 ? undefined : (x === 0 ? undefined : field.getCell2D(x - 1, y + 1)));

    return neighbours.filter((n) => n !== undefined);
  }

  private placeBombs(count: number) {
    const field = this.fieldRepository.get();
    let bombsLeftToPlace = count;

    while (bombsLeftToPlace) {
      const index = Math.floor(Math.random() * field.length());

      if (!field.getCell1D(index).isBomb) {
        field.getCell1D(index).isBomb = true;
        bombsLeftToPlace--;
      }
    }
  }

  private initField(columns: number, rows: number) {
    const fieldSize = columns * rows;
    let fieldData: Array<Cell> = [];

    this.columns = columns;
    this.rows = rows;

    for (let i = 0; i < fieldSize; i++) {
      fieldData[i] = {
        isBomb: false,
        revealed: false,
        index: i,
      };
    }

    this.fieldRepository.create(fieldData, columns, rows);
  }
}
