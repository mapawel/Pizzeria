import { OrderToGo } from '../Order/OrderToGo';
import { OrderIn } from '../Order/OrderIn';
import { OrdersServiceCollections } from '../Order/Orders-service.collections.enum';
import { OrdersStoreError } from '../exceptions/Orders.store.exception';
import { OrderReqDTO } from '../DTO/OrderReq.dto';
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
  ): OrderReqDTO {
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

  public addOrder(
    order: Order<WorkerItem | null, TableItem | null>,
    orderType: OrdersServiceCollections
  ): Order<WorkerItem | null, TableItem | null> {
    if (
      (orderType === OrdersServiceCollections.ORDERS_IN_PROGRESS ||
        orderType === OrdersServiceCollections.ORDERS_FINISHED) &&
      !order.cook
    )
      throw new OrdersStoreError(
        'Cook has to be passed while adding these types of orders',
        { order, orderType }
      );
    const updatedMap = this[orderType].set(order.id, order);

    return updatedMap.get(order.id) as Order<
      WorkerItem | null,
      TableItem | null
    >;
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
    nameId: string,
    orderType: OrdersServiceCollections
  ): Order<WorkerItem | null, TableItem | null> {
    const foundOrder = this[orderType].get(nameId);
    if (!foundOrder)
      throw new OrdersStoreError(
        'Pizza with passed nameId not found in store, could not proceed.',
        { nameId }
      );
    return foundOrder;
  }
}
