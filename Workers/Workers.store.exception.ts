import { Role } from './Worker/Roles.enum';
import { Worker } from './Worker/Worker.class';

export class WorkersStoreError extends Error {
  constructor(
    readonly message: string,
    readonly payload?: { id?: string; worker?: Worker, role?: Role }
  ) {
    super(message);
  }
}
