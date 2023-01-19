import { DiscountError } from '../Discount.exception';
import { Discount } from '../Discount/Discount.class';

export class DiscountStore {
  private static instance: DiscountStore | null;
  private readonly discounts: Map<string, Discount> = new Map();

  private constructor() {}

  public static getInstance() {
    if (DiscountStore.instance) return DiscountStore.instance;
    return (DiscountStore.instance = new DiscountStore());
  }

  public static resetInstance() {
    DiscountStore.instance = null;
  }

  public findDiscountByCode(code: string): Discount {
    return this.validateIfExisting(this.unifyCode(code));
  }

  public addOrUpdateDiscount(element: Discount): boolean {
    this.discounts.set(this.unifyCode(element.code), element);
    return true;
  }

  public removeDiscountByCode(code: string): boolean {
    this.validateIfExisting(this.unifyCode(code));
    this.discounts.delete(this.unifyCode(code));
    return true;
  }

  private validateIfExisting(code: string): Discount {
    const foundDiscount = this.discounts.get(code);
    if (!foundDiscount)
      throw new DiscountError(
        'Discount with passed code not found in store, could not proceed.',
        { code }
      );
    return foundDiscount;
  }

  private unifyCode(code: string): string {
    return code.replace(/\s/g, '').toUpperCase();
  }
}
