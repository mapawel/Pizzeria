import { DiscountError } from './Discount.exception';
import { DiscountType } from './Discount/Discount-type.enum';
import { Discount } from './Discount/Discount.class';

export class DiscountStore {
  static instance: DiscountStore | null;
  private readonly discounts: Map<string, Discount> = new Map();

  private constructor() {}

  public static getInstance() {
    if (DiscountStore.instance) return DiscountStore.instance;
    return (DiscountStore.instance = new DiscountStore());
  }

  public static resetInstance() {
    DiscountStore.instance = null;
  }

  public findItemById(code: string): Discount {
    const foundDiscount = this.validateIfExisting(code);
    if (
      foundDiscount.type === DiscountType.limited &&
      foundDiscount?.getQty() < 1
    )
      throw new DiscountError('This voucher is not available any more.', {
        code,
      });
    return foundDiscount;
  }

  public getAllDiscountsArr(): Discount[] {
    return Array.from(this.discounts, ([_, value]) => value);
  }

  public addOrUpdateItem(discount: Discount): boolean {
    // qty VALIDATOR to ADD here
    this.discounts.set(discount.code, discount);
    return true;
  }

  public removeExistingItem(discount: Discount): boolean {
    this.validateIfExisting(discount.code);
    this.discounts.delete(discount.code);
    return true;
  }

  private validateIfExisting(code: string): Discount {
    const foundIngredient = this.discounts.get(
      code.replace(/\s/g, '').toUpperCase()
    );
    if (!foundIngredient)
      throw new DiscountError(
        'Discount with passed code not found in store, could not proceed.',
        { code }
      );
    return foundIngredient;
  }
}
