import { DiscountError } from '../Discount.exception';
import { Discount } from '../Discount/Discount.class';
import { DiscountLimited } from '../Discount/Discount-limited.class';
export class DiscountStore {
  private static instance: DiscountStore | null;
  private readonly discounts: Map<string, Discount | DiscountLimited> =
    new Map();

  private constructor() {}

  public static getInstance() {
    if (DiscountStore.instance) return DiscountStore.instance;
    return (DiscountStore.instance = new DiscountStore());
  }

  public static resetInstance() {
    DiscountStore.instance = null;
  }

  public getAllDiscounts(): Map<string, Discount | DiscountLimited> {
    return new Map(this.discounts);
  }

  public findDiscountByCode(code: string): Discount | DiscountLimited {
    return this.validateIfExisting(this.unifyCode(code));
  }

  public addOrUpdateDiscount(
    element: Discount | DiscountLimited
  ): Discount | DiscountLimited {
    const updatedMap: Map<string, Discount | DiscountLimited> =
      this.discounts.set(this.unifyCode(element.code), element);
    return updatedMap.get(this.unifyCode(element.code)) as
      | Discount
      | DiscountLimited;
  }

  public removeDiscountByCode(code: string): boolean {
    this.validateIfExisting(this.unifyCode(code));
    this.discounts.delete(this.unifyCode(code));
    return true;
  }

  private validateIfExisting(discountCode: string): Discount | DiscountLimited {
    const foundDiscount = this.discounts.get(discountCode);
    if (!foundDiscount)
      throw new DiscountError(
        'Discount with passed code not found in store, could not proceed.',
        { discountCode }
      );
    return foundDiscount;
  }

  private unifyCode(discountCode: string): string {
    return discountCode.replace(/\s/g, '').toUpperCase();
  }
}
