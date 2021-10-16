export class Cell {
    index: number;
    isBomb: boolean;
    nearBombs?: number;
    revealed: boolean;
}