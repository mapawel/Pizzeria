import { v4 as uuidv4 } from 'uuid';

export class Table {
  readonly id: string;
  public constructor(
    readonly name: string,
    readonly sits: number,
    readonly sitsAvailable: number,
    readonly isAvailable: boolean
  ) {
    this.id = uuidv4();
  }
}
