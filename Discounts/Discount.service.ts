import { DiscountError } from './exceptions/Discount.exception';
import { DiscountStore } from './Discount-store/Discount.store';
import { DiscountResDTO } from './DTO/DiscountRes.dto';

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

  public findDiscountByCode(code: string): DiscountResDTO {
    return this.discounts.findDiscountByCode(code);
  }

  public addDiscount(
    code: string,
    discountPercent: number,
    limitQty?: number
  ): DiscountResDTO {
    return this.discounts.addDiscount(code, discountPercent, limitQty);
  }

  public removeDiscount(code: string): boolean {
    return this.discounts.removeDiscount(code);
  }

  public getValidDiscountPercent(code: string, qtyNeeded?: number): number {
    const foundDiscountDTO = this.findDiscountByCode(code);
    if (foundDiscountDTO.limitQty) {
      if (!qtyNeeded)
        throw new DiscountError(
          'For limited type of discount you have to pass qty needed param',
          { discountCode: code }
        );
      this.validateQtyVsNeeded(foundDiscountDTO, qtyNeeded);
    }
    return foundDiscountDTO.discountPercent;
  }

  public useLimitedDiscount(code: string, qtyNeeded: number): boolean {
    const foundDiscountDTO = this.findDiscountByCode(code);
    if (foundDiscountDTO.limitQty) {
      this.validateQtyVsNeeded(foundDiscountDTO, qtyNeeded);
      return this.discounts.useLimitedDiscount(
        foundDiscountDTO.code,
        qtyNeeded
      );
    }
    return false;
  }

  private validateQtyVsNeeded(
    discountDTO: DiscountResDTO,
    qtyNeeded: number
  ): void {
    if (discountDTO.limitQty && discountDTO.limitQty < qtyNeeded)
      throw new DiscountError(
        'Quantity for this type of dicsount is lower than quantity needed!',
        { discountCode: discountDTO.code }
      );
  }
}
