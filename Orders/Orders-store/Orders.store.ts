import { WorkerItem } from '../../Workers/Worker-item.type';
import { Order } from '../Order/Order.class';
import { TableItem } from '../../Tables/Table-item.type';
import { OrdersServiceCollections } from '../Order/Orders-service.collections.enum';
import { OrdersStoreError } from './Orders.store.exception';

export class OrdersStore {
  private static instance: OrdersStore | null;
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

  public findOrderById(
    orderId: string,
    orderType: OrdersServiceCollections
  ): Order<WorkerItem | null, TableItem | null> {
    return this.validateIfExisting(orderId, orderType);
  }

  // public setCookForOrderById(
  //   orderId: string,
  //   orderType: OrdersServiceCollections,
  //   cook: WorkerItem
  // ): Order<WorkerItem | null, TableItem | null> {
  //   const foundOrder: Order<WorkerItem | null, TableItem | null> =
  //     this.validateIfExisting(orderId, orderType);
  //   foundOrder.cook = cook;
  //   return foundOrder;
  // }

  public addOrUpdateOrder(
    order: Order<WorkerItem | null, TableItem | null>,
    orderType: OrdersServiceCollections
  ): Order<WorkerItem | null, TableItem | null> {
    if (
      (orderType === OrdersServiceCollections.ordersInProgress ||
        orderType === OrdersServiceCollections.ordersFinished) &&
      !order.cook
    )
      throw new OrdersStoreError(
        'Cook has to be passed while adding these types of orders',
        { order, orderType }
      );
    const updatedMap = this[orderType].set(order.id, order);
    
    return updatedMap.get(order.id) as Order<WorkerItem | null, TableItem | null>;
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
