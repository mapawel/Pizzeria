import { DiscountStoreError } from './Discount-store.exception';
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
  //TODO to remove
  test() {
    return new Map(this.discounts);
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
    const foundIngredient = this.discounts.get(code);
    if (!foundIngredient)
      throw new DiscountStoreError(
        'Discount with passed code not found in store, could not proceed.',
        { code }
      );
    return foundIngredient;
  }
}