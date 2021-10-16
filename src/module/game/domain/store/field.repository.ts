import { Cell } from '../entity/cell.entity';
import { Field } from '../entity/field.entity';

export interface FieldRepository {
  create(data: Array<Cell>, columns: number, rows: number);
  get(): Field;
}
