import { Discount } from './Discount';
import { isPlusOrZero } from '../../general-validators/plusOrZero.validator';
import { isPlus } from '../../general-validators/plus.validator';

export class DiscountLimited extends Discount {
  limitQty: number;
  public constructor(code: string, discountPercent: number, limitQty: number) {
    isPlus(limitQty, 'Passed coupon limit qty');
    super(code, discountPercent);
    this.limitQty = limitQty;
  }

  public getLimitQty(): number {
    return this.limitQty;
  }

  public setNewLimitQty(newLimitQty: number): void {
    isPlusOrZero(newLimitQty, 'Passed coupon limit qty');
    this.limitQty = newLimitQty;
  }
}
