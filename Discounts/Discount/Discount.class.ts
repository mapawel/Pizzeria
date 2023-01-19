export class Discount {
  readonly code: string;
  public constructor(code: string, readonly discountPercent: number) {
    // discount percent validator to ADD!
    this.code = code.replace(/\s/g, '').toUpperCase();
  }
}
