import { v4 as uuidv4 } from 'uuid';
import { Role } from './Roles.enum';

export class Worker {
  readonly id: string;
  readonly name: string;
  public constructor(
    name: string,
    readonly role: Role,
    readonly isAvailable: boolean
  ) {
    this.id = uuidv4();
    this.name = name.trim().toUpperCase();
  }
}
