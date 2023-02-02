import { v4 as uuidv4 } from 'uuid';

export class Discount {
  readonly id: string;
  readonly code: string;
  public constructor(code: string, readonly discountPercent: number) {
    // discount percent validator to ADD!
    this.id = uuidv4();
    this.code = code.replace(/\s/g, '').toUpperCase();
  }
}
