import { Cell } from './cell.entity';

export class Field {
  constructor(
    private data: Array<Cell>,
    private readonly columns: number,
    private readonly rows: number,
  ) {}

  length(): number {
    return this.data.length;
  }

  getData(): Array<Cell> {
    return this.data;
  }

  getRows(): number {
    return this.rows;
  }

  setCell1D(index: number, cell: Partial<Cell>) {
    this.data[index] = { ...this.data[index], ...cell };
  }

  getCell1D(index: number): Cell {
    return this.data[index];
  }

  getCell2D(x: number, y: number): Cell {
    return this.data[y * this.rows + x];
  }

  clear() {
    this.data = [];
  }
}
