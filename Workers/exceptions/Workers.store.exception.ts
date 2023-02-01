import { Role } from '../Worker/Roles.enum';

export class WorkersStoreError extends Error {
  constructor(
    readonly message: string,
    readonly payload?: { id?: string; name?: string; role?: Role }
  ) {
    super(message);
  }
}
