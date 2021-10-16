import { Injectable } from '@nestjs/common';

import { Cell } from './entity/cell.entity';

@Injectable()
export class AppService {
  columns: number;
  rows: number;
  field: Array<Cell> = [];

  async startGame(
    columns: number,
    rows: number,
    bombs: number,
  ): Promise<Array<Cell>> {
    await this.initField(columns, rows);
    await this.placeBombs(bombs);
    await this.resolve();

    return this.field;
  }

  async playTurn(
    x: number,
    y: number,
  ): Promise<{ field: Array<Cell>; gameOver: boolean }> {
    const currentIndex = y * this.rows + x;

    if (this.field[currentIndex].isBomb) {
      this.field = this.field.map((cell) => {
        cell.revealed = true;
        return cell;
      });
      return { field: this.field, gameOver: true };
    }

    this.autoReveal(currentIndex);

    return { field: this.field, gameOver: false };
  }

  private autoReveal(index: number) {
    const cell = this.field[index];

    if (cell.revealed) {
      return;
    }

    cell.revealed = true;

    if (cell.nearBombs === 0) {
      const neighbours = this.getNeighbours(index);

      for (let n of neighbours) {
        this.autoReveal(n.index);
      }
    }
  }

  private resolve() {
    for (let i = 0; i < this.field.length; i++) {
      const neighbours: Array<Cell> = this.getNeighbours(i);

      this.field[i].nearBombs = neighbours.reduce((bombsCount, currentCell) => {
        return (bombsCount += currentCell.isBomb ? 1 : 0);
      }, 0);
    }
  }

  private getCell(x: number, y: number): Cell {
    return this.field[y * this.rows + x];
  }

  // 0 0 0
  // 0 0 0
  // 0 0 0
  private getNeighbours(index: number): Array<Cell> {
    const x = index % this.rows;
    const y = Math.floor(index / this.rows);
    let neighbours = [];

    const r = x === this.columns - 1 ? undefined : this.field[index + 1];
    const l = x === 0 ? undefined : this.field[index - 1];
    // prettier-ignore
    const tr = y === 0 ? undefined : (x === this.columns - 1 ? undefined : this.getCell(x + 1, y - 1));
    // prettier-ignore
    const t = y === 0 ? undefined : this.getCell(x, y - 1);
    // prettier-ignore
    const tl = y === 0 ? undefined : (x === 0 ? undefined : this.getCell(x - 1, y - 1));

    // prettier-ignore
    const br = y === this.rows - 1 ? undefined : (x === this.columns - 1 ? undefined : this.getCell(x + 1, y + 1));
    // prettier-ignore
    const b = y === this.rows - 1 ? undefined : this.getCell(x, y + 1);
    // prettier-ignore
    const bl = y === this.rows - 1 ? undefined : (x === 0 ? undefined : this.getCell(x - 1, y + 1));

    neighbours.push(r);
    neighbours.push(l);
    neighbours.push(tr);
    neighbours.push(t);
    neighbours.push(tl);
    neighbours.push(br);
    neighbours.push(b);
    neighbours.push(bl);

    return neighbours.filter((n) => n !== undefined);
  }

  private placeBombs(count: number) {
    let bombsLeftToPlace = count;

    while (bombsLeftToPlace) {
      const index = Math.floor(Math.random() * this.field.length);

      if (!this.field[index].isBomb) {
        this.field[index].isBomb = true;
        bombsLeftToPlace--;
      }
    }
  }

  private initField(columns: number, rows: number) {
    const fieldSize = columns * rows;

    this.columns = columns;
    this.rows = rows;

    for (let i = 0; i < fieldSize; i++) {
      this.field[i] = { isBomb: false, revealed: false, index: i };
    }
  }

  clearGame() {
    this.field = [];
  }
}
