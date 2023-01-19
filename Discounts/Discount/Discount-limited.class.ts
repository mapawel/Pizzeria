import { Discount } from './Discount.class';

export class DiscountLimited extends Discount {
  public constructor(
    code: string,
    discountPercent: number,
    private limitQty: number
  ) {
    // discount percent and limit qty validators to ADD!
    super(code, discountPercent);
  }

  public getLimitQty(): number {
    return this.limitQty;
  }

  public setNewLimitQty(newLimitQty: number): void {
    // validator
    this.limitQty = newLimitQty;
  }
}
