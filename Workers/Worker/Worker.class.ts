import { v4 as uuidv4 } from 'uuid';
import { Role } from './Roles.enum';

export class Worker {
  readonly id: string;
  public constructor(readonly name: string, readonly role: Role) {
    this.id = uuidv4();
  }
}
