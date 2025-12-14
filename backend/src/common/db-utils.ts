import { NotFoundException } from '@nestjs/common';

export function assertFound<T>(
  rows: T[],
  id: string,
  entityName = 'Record',
): T {
  if (rows.length === 0) {
    throw new NotFoundException(`${entityName} with id ${id} does not exist`);
  }
  return rows[0];
}
