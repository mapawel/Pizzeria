import { Discount } from '../Discount/Discount';
import { DiscountLimited } from '../Discount/Discount-limited';
import { DiscountResDTO } from './Discount-res.dto';
import { DiscountType } from '../Discount/Discount-type.enum';

export class DiscountDTOMapper {
  public static mapToResDTO(
    discount: Discount | DiscountLimited
  ): DiscountResDTO {
    return {
      code: discount.code,
      discountPercent: discount.discountPercent,
      limitQty:
        discount.type === DiscountType.LIMITED
          ? (discount as DiscountLimited).limitQty
          : null,
    };
  }
}
