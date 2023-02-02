import { DiscountError } from '../exceptions/Discount.exception';
import { Discount } from '../Discount/Discount';
import { DiscountLimited } from '../Discount/DiscountLimited';
import { DiscountResDTO } from 'Discounts/DTO/DiscountRes.dto';

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

  public useLimitedDiscount(code: string, qtyNeeded: number): boolean {
    const foundDiscount: Discount | DiscountLimited = this.validateIfExisting(
      this.unifyCode(code)
    );
    if (foundDiscount instanceof DiscountLimited) {
      foundDiscount.setNewLimitQty(foundDiscount.getLimitQty() - qtyNeeded);
      return true;
    }
    return false;
  }

  public findDiscountByCode(code: string): DiscountResDTO {
    const foundDiscount: Discount | DiscountLimited = this.validateIfExisting(
      this.unifyCode(code)
    );
    return {
      code: foundDiscount.code,
      discountPercent: foundDiscount.discountPercent,
      limitQty:
        foundDiscount instanceof DiscountLimited
          ? foundDiscount.getLimitQty
          : null,
    };
  }

  public addDiscount(
    code: string,
    discountPercent: number,
    limitQty?: number
  ): DiscountResDTO {
    const newDiscount: Discount | DiscountLimited = limitQty
      ? new DiscountLimited(code, discountPercent, limitQty)
      : new Discount(code, discountPercent);

    const updatedMap: Map<string, Discount | DiscountLimited> =
      this.discounts.set(this.unifyCode(code), newDiscount);

    const addedDiscount: Discount | DiscountLimited = updatedMap.get(
      this.unifyCode(newDiscount.code)
    ) as Discount | DiscountLimited;

    return {
      code: addedDiscount.code,
      discountPercent: addedDiscount.discountPercent,
      limitQty:
        addedDiscount instanceof DiscountLimited
          ? addedDiscount.getLimitQty
          : null,
    };
  }

  public removeDiscount(code: string): boolean {
    this.validateIfExisting(this.unifyCode(code));
    this.discounts.delete(this.unifyCode(code));
    return true;
  }

  public updateDiscount(
    code: string,
    discountPercent: number,
    limitQty?: number
  ): DiscountResDTO {
    const fountDiscount: Discount | DiscountLimited =
      this.validateIfExisting(code);

    const updatedMap: Map<string, Discount | DiscountLimited> =
      this.discounts.set(
        this.unifyCode(code),
        fountDiscount instanceof DiscountLimited
          ? {
              ...fountDiscount,
              discountPercent,
              limitQty,
            }
          : {
              ...fountDiscount,
              discountPercent,
            }
      );

    const updatedDiscount: Discount | DiscountLimited = updatedMap.get(
      this.unifyCode(fountDiscount.code)
    ) as Discount | DiscountLimited;

    return {
      code: updatedDiscount.code,
      discountPercent: updatedDiscount.discountPercent,
      limitQty:
        updatedDiscount instanceof DiscountLimited
          ? updatedDiscount.getLimitQty
          : null,
    };
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
