import { DiscountError } from './Discount.exception';
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
    return this.validateIfExisting(code);
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
