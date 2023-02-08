import { Discount } from '../Discount/Discount';
import { DiscountLimited } from '../Discount/Discount-limited';
import { DiscountResDTO } from './Discount-res.dto';

export class DiscountDTOMapper {
  public static mapToResDTO(discount: Discount | DiscountLimited): DiscountResDTO {
    return {
      code: discount.code,
      discountPercent: discount.discountPercent,
      limitQty:
        discount instanceof DiscountLimited ? discount.getLimitQty() : null,
    };
  }
}
