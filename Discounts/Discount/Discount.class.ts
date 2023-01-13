import { DiscountError } from '../Discount.exception';
import { DiscountType } from './Discount-type.enum';

export class Discount {
  readonly code: string;
  public constructor(
    code: string,
    readonly type: DiscountType,
    readonly discountPercent: number,
    private qty?: number
  ) {
    this.code = code.replace(/\s/g, '').toUpperCase();
    if (type === DiscountType.limited && !qty)
      throw new DiscountError('Qty has to be passed in this case', {
        code,
        type,
        qty,
      });
  }

  public useDiscountQty(qtyToUse: number): boolean {
    if (this.type === DiscountType.limited && qtyToUse > (this.qty || 0))
      throw new DiscountError('This voucher is not available any more.', {
        code: this.code,
      });
    if (this.qty) {
      this.qty -= qtyToUse;
      return true;
    }
    return false;
  }

  public getQty(): number {
    return this?.qty || 0;
  }
}
