import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Cell } from '../../domain/entity/cell.entity';
import { Field } from '../../domain/entity/field.entity';
import { FieldRepository } from '../../domain/store/field.repository';
import { FIELD_REPOSITORY } from '../../infrastructure/store/field/field.repository.provider';

export class PlayTurnCommand {
  constructor(public readonly x: number, public readonly y: number) {}
}

/**
 * This use-case is allowing a player to play a turn by triggering a cell in the field
 * The new field status is revealed when a player doesn't trigger a bomb.
 * The entire field is revealed when a player trigger a bomb.
 */
@CommandHandler(PlayTurnCommand)
export class PlayTurnCommandHandler
  implements ICommandHandler<PlayTurnCommand>
{
  private columns: number;
  private rows: number;

  constructor(
    @Inject(FIELD_REPOSITORY) private readonly fieldRepository: FieldRepository,
  ) {}

  async execute({
    x,
    y,
  }: PlayTurnCommand): Promise<{ field: Field; gameOver: boolean }> {
    const field = this.fieldRepository.get();

    if (field.getCell2D(x, y).isBomb) {
      for (let index = 0; index < field.length(); index++) {
        field.setCell1D(index, { revealed: true });
      }
      return { field, gameOver: true };
    }

    this.autoReveal(y * field.getRows() + x, field);

    return { field, gameOver: false };
  }

  private autoReveal(index: number, field: Field) {
    const cell = field.getCell1D(index);

    if (cell.revealed) {
      return;
    }

    cell.revealed = true;

    if (cell.nearBombs === 0) {
      const neighbours = this.getNeighbours(index);

      for (let n of neighbours) {
        this.autoReveal(n.index, field);
      }
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
}
