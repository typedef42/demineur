import { ClassProvider } from '@nestjs/common';

import { InMemFieldRepository } from './in-mem/in-mem-field.repository';

export const FIELD_REPOSITORY = Symbol();

export const FieldRepositoryProvider: ClassProvider = {
  provide: FIELD_REPOSITORY,
  useClass: InMemFieldRepository,
};
