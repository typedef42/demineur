import { Cell } from '../../../../domain/entity/cell.entity';
import { Field } from '../../../../domain/entity/field.entity';
import { FieldRepository } from '../../../../domain/store/field.repository';

export class InMemFieldRepository implements FieldRepository {
  private field: Field;

  create(data: Array<Cell>, columns: number, rows: number) {
    this.field = new Field(data, columns, rows);
  }

  get(): Field {
    return this.field;
  }

  clear() {
    this.field.clear();
  }
}
