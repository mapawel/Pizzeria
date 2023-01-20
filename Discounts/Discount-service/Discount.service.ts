import { DiscountError } from '../Discount.exception';
import { Discount } from '../Discount/Discount.class';
import { DiscountStore } from '../Discount-store/Discount.store';
import { DiscountLimited } from '../Discount/Discount-limited.class';

export class DiscountService {
  private static instance: DiscountService | null;
  private discounts: DiscountStore;

  private constructor() {
    this.discounts = DiscountStore.getInstance();
  }

  public static getInstance() {
    if (DiscountService.instance) return DiscountService.instance;
    return (DiscountService.instance = new DiscountService());
  }

  public static resetInstance() {
    DiscountService.instance = null;
  }

  public getAllDiscounts(): (Discount | DiscountLimited)[] {
    return Array.from(this.discounts.getAllDiscounts(), ([_, value]) => value);
  }

  public findDiscountByCode(code: string): Discount | DiscountLimited {
    return this.discounts.findDiscountByCode(code);
  }

  public addOrUpdateDiscount(element: Discount | DiscountLimited): boolean {
    return this.discounts.addOrUpdateDiscount(element);
  }

  public removeDiscountByCode(code: string): boolean {
    return this.discounts.removeDiscountByCode(code);
  }

  public getValidDiscountPercent(code: string, qtyNeeded?: number): number {
    const foundDiscountInstance = this.findDiscountByCode(code);
    if (foundDiscountInstance instanceof DiscountLimited) {
      if (!qtyNeeded)
        throw new DiscountError(
          'For limited type of discount you have to pass qty needed param',
          { code }
        );
      this.validateQtyVsNeeded(foundDiscountInstance, qtyNeeded);
    }
    return foundDiscountInstance.discountPercent;
  }

  public useLimitedDiscount(code: string, qtyNeeded: number): boolean {
    const foundDiscountInstance = this.findDiscountByCode(code);
    if (foundDiscountInstance instanceof DiscountLimited) {
      this.validateQtyVsNeeded(foundDiscountInstance, qtyNeeded);
      foundDiscountInstance.setNewLimitQty(
        foundDiscountInstance.getLimitQty() - qtyNeeded
      );
    }
    return true;
  }

  private validateQtyVsNeeded(
    discountInstance: DiscountLimited,
    qtyNeeded: number
  ): void {
    if (discountInstance.getLimitQty() < qtyNeeded)
      throw new DiscountError(
        'Quantity for this type of dicsount is lower than quantity needed!',
        { code: discountInstance.code }
      );
  }
}
