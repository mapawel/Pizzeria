import { OrderIn } from '../Order/Order-in';
import { OrderToGo } from '../Order/Order-to-go';
import { OrderResDTO } from './Order-res.dto';
import { OrderItem } from '../Order/Order-item.type';
import { OrderType } from '../Order/Order-type.enum';

export class OrderDTOMapper {
  public static mapToResDTO(order: OrderIn | OrderToGo): OrderResDTO {
    return {
      id: order.id,
      orderItems: order.orderItems.map((o: OrderItem) => ({
        pizzaNameId: o.pizzaNameId,
        qty: o.qty,
      })),
      totalValue: order.totalValue,
      cookId: order.cookId,
      tableId: order.orderType === OrderType.IN ? order.tableId : null,
      tablePerson: order.orderType === OrderType.IN ? order.tablePerson : null,
    };
  }
}
