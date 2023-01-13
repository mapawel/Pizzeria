import { DiscountType } from './Discount/Discount-type.enum';

export class DiscountError extends Error {
  constructor(
    readonly message: string,
    readonly payload?: { code?: string; qty?: number; type?: DiscountType }
  ) {
    super(message);
  }
}
