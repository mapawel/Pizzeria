import { OrderToGo } from '../Order/OrderToGo';
import { OrderIn } from '../Order/OrderIn';
import { OrdersServiceCollections } from '../Order/Orders-service.collections.enum';
import { OrdersStoreError } from '../exceptions/Orders.store.exception';
import { OrderResDTO } from '../DTO/OrderRes.dto';
import { OrderItem } from 'Orders/Order/OrderItem.type';

export class OrdersStore {
  private static instance: OrdersStore | null;
  private readonly ordersPending: Map<string, OrderIn | OrderToGo> = new Map();
  private readonly ordersInProgress: Map<string, OrderIn | OrderToGo> =
    new Map();
  private readonly ordersFinished: Map<string, OrderIn | OrderToGo> = new Map();

  private constructor() {}

  public static getInstance() {
    if (OrdersStore.instance) return OrdersStore.instance;
    return (OrdersStore.instance = new OrdersStore());
  }

  public static resetInstance() {
    OrdersStore.instance = null;
  }

  public findOrderById(
    id: string,
    orderType: OrdersServiceCollections
  ): OrderResDTO {
    const foundOrder: OrderIn | OrderToGo = this.validateIfExisting(
      id,
      orderType
    );

    return {
      orderItems: foundOrder.orderItems.map((order: OrderItem) => ({
        pizzaNameId: order.pizzaNameId,
        qty: order.qty,
        unitPrice: order.unitPrice,
      })),
      totalValue: foundOrder.totalValue,
      cookId: foundOrder.cookId,
      tableId: foundOrder instanceof OrderIn ? foundOrder.tableId : null,
    };
  }

  public addOrUpdateOrder(
    order: OrderIn | OrderToGo,
    orderType: OrdersServiceCollections
  ): OrderResDTO {
    const updatedMap = this[orderType].set(order.id, order);

    const uptadetOrder: OrderIn | OrderToGo = updatedMap.get(order.id) as
      | OrderIn
      | OrderToGo;

    return {
      orderItems: uptadetOrder.orderItems.map((order: OrderItem) => ({
        pizzaNameId: order.pizzaNameId,
        qty: order.qty,
        unitPrice: order.unitPrice,
      })),
      totalValue: uptadetOrder.totalValue,
      cookId: uptadetOrder.cookId,
      tableId: uptadetOrder instanceof OrderIn ? uptadetOrder.tableId : null,
    };
  }

  public deleteOrder(
    orderId: string,
    orderType: OrdersServiceCollections
  ): boolean {
    const foundOrder = this.validateIfExisting(orderId, orderType);
    this[orderType].delete(foundOrder.id);
    return true;
  }

  private validateIfExisting(
    id: string,
    orderType: OrdersServiceCollections
  ): OrderIn | OrderToGo {
    const foundOrder = this[orderType].get(id);
    if (!foundOrder)
      throw new OrdersStoreError(
        'Order with passed id not found in store, could not proceed.',
        { id }
      );
    return foundOrder;
  }
}
