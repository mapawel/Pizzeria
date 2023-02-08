import { OrderIn } from '../Order/Order-in';
import { OrderToGo } from '../Order/Order-to-go';
import { OrderResDTO } from './Order-res.dto';
import { OrderItem } from '../Order/Order-item.type';

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
      tableId: order.orderType === 'in' ? order.tableId : null,
      tablePerson: order.orderType === 'in' ? order.tablePerson : null,
    };
  }
}
