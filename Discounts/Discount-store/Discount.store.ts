import { DiscountError } from '../exceptions/Discount.exception';
import { Discount } from '../Discount/Discount';
import { DiscountLimited } from '../Discount/Discount-limited';
import { DiscountResDTO } from '../DTO/Discount-res.dto';
import { DiscountDTOMapper } from '../DTO/Discount-dto.mapper';
import { isPlusOrZero } from '../../general-validators/plus-or-zero.validator';

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
    const foundDiscount: Discount | DiscountLimited = this.getIfExisting(
      this.unifyCode(code)
    );
    if (foundDiscount instanceof DiscountLimited) {
      foundDiscount.setNewLimitQty(foundDiscount.getLimitQty() - qtyNeeded);
      return true;
    }
    return false;
  }

  public findDiscountByCode(code: string): DiscountResDTO {
    const foundDiscount: Discount | DiscountLimited = this.getIfExisting(
      this.unifyCode(code)
    );

    return DiscountDTOMapper.mapToResDTO(foundDiscount);
  }

  public addDiscount(
    code: string,
    discountPercent: number,
    limitQty?: number
  ): DiscountResDTO {
    const newDiscount: Discount | DiscountLimited = limitQty
      ? new DiscountLimited(code, discountPercent, limitQty)
      : new Discount(code, discountPercent);

    this.discounts.set(this.unifyCode(code), newDiscount);

    return DiscountDTOMapper.mapToResDTO(newDiscount);
  }

  public removeDiscount(code: string): boolean {
    const result: boolean = this.discounts.delete(this.unifyCode(code));
    if (!result) this.throwValidateError(code);
    return true;
  }

  public updateDiscount(
    code: string,
    discountPercent: number,
    limitQty?: number
  ): DiscountResDTO {
    const fountDiscount: Discount | DiscountLimited = this.getIfExisting(
      this.unifyCode(code)
    );
    if (limitQty) isPlusOrZero(limitQty, 'Qty')
    const newDiscount: Discount | DiscountLimited =
      fountDiscount instanceof DiscountLimited
        ? {
            ...fountDiscount,
            discountPercent,
            limitQty,
          }
        : {
            ...fountDiscount,
            discountPercent,
          };

    this.discounts.set(this.unifyCode(code), newDiscount);
    return DiscountDTOMapper.mapToResDTO(newDiscount);
  }

  private throwValidateError(discountCode: string): void {
    throw new DiscountError(
      'Discount with passed code not found in store, could not proceed.',
      { discountCode }
    );
  }

  private getIfExisting(discountCode: string): Discount | DiscountLimited {
    const foundDiscount = this.discounts.get(discountCode);
    if (!foundDiscount) this.throwValidateError(discountCode);
    return foundDiscount as Discount | DiscountLimited;
  }

  private unifyCode(discountCode: string): string {
    return discountCode.replace(/\s/g, '').toUpperCase();
  }
}
