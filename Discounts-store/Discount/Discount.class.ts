import { DiscountStoreError } from '../Discount-store.exception';
import { DiscountType } from './Discount-type.enum';

export class Discount {
  readonly code: string;
  public constructor(
    code: string,
    private type: DiscountType,
    private discountPercent: number,
    private qty?: number
  ) {
    this.code = code.replace(/\s/g, '').toUpperCase();
    if (type === DiscountType.limited && !qty)
      throw new DiscountStoreError('Qty has to be passed in this case', {
        code,
        type,
        qty,
      });
  }

  public useDiscountQty(qtyToUse: number): boolean {
    if (this.qty) {
      this.qty -= qtyToUse;
      return true;
    }
    return false;
  }
}
