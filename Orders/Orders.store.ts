import { WorkerItem } from '../Workers/Worker-item.type';
import { Order } from './Order/Order.class';
import { TableItem } from '../Tables/Table-item.type';
import { OrdersServiceCollections } from './Order/Orders-service.collections.enum';
import { OrdersStoreError } from './Orders.store.exception';

export class OrdersStore {
  static instance: OrdersStore | null;
  private readonly ordersPending: Map<
    string,
    Order<WorkerItem | null, TableItem | null>
  > = new Map();
  private readonly ordersInProgress: Map<
    string,
    Order<WorkerItem | null, TableItem | null>
  > = new Map();
  private readonly ordersFinished: Map<
    string,
    Order<WorkerItem | null, TableItem | null>
  > = new Map();

  private constructor() {}

  public static getInstance() {
    if (OrdersStore.instance) return OrdersStore.instance;
    return (OrdersStore.instance = new OrdersStore());
  }

  public static resetInstance() {
    OrdersStore.instance = null;
  }

  public addOrder(
    order: Order<WorkerItem | null, TableItem | null>,
    orderType: OrdersServiceCollections
  ): boolean {
    if (
      (orderType === OrdersServiceCollections.ordersInProgress ||
        orderType === OrdersServiceCollections.ordersFinished) &&
      !order.cook
    )
      throw new OrdersStoreError(
        'Cook has to be passed while adding these types of orders',
        { order, orderType }
      );
    this[orderType].set(order.id, order);
    return true;
  }

  public deleteOrder(
    order: Order<WorkerItem | null, TableItem | null>,
    orderType: OrdersServiceCollections
  ): boolean {
    this[orderType].delete(order.id);
    return true;
  }
}
