import { WorkerItem } from '../Workers/WorkerItem.type';
import { Order } from './Order/Order.class';
import { TableItem } from '../Tables/TableItem.type';
import { OrdersServiceCollections } from './Order/Orders-service.collections.enum';
import { OrdersServiceError } from './Orders-service.exception';
import { IOrdersService } from './Orders-service.interface';

export class OrdersService implements IOrdersService {
  static instance: OrdersService | null;
  private readonly ordersPending: Map<
    string,
    Order<WorkerItem, WorkerItem | null, TableItem | null>
  > = new Map();
  private readonly ordersInProgress: Map<
    string,
    Order<WorkerItem, WorkerItem | null, TableItem | null>
  > = new Map();
  private readonly ordersFinished: Map<
    string,
    Order<WorkerItem, WorkerItem | null, TableItem | null>
  > = new Map();

  private constructor() {}

  public static getInstance() {
    if (OrdersService.instance) return OrdersService.instance;
    return (OrdersService.instance = new OrdersService());
  }

  public static resetInstance() {
    OrdersService.instance = null;
  }

  public addOrder(
    order: Order<WorkerItem, WorkerItem | null, TableItem | null>,
    orderType: OrdersServiceCollections
  ): boolean {
    if (
      (orderType === OrdersServiceCollections.ordersInProgress ||
        orderType === OrdersServiceCollections.ordersFinished) &&
      !order.cook
    )
      throw new OrdersServiceError(
        'Cook has to be passed while adding these types of orders',
        { order, orderType }
      );
    this[orderType].set(order.id, order);
    return true;
  }

  public deleteOrder(
    order: Order<WorkerItem, WorkerItem | null, TableItem | null>,
    orderType: OrdersServiceCollections
  ): boolean {
    this[orderType].delete(order.id);
    return true;
  }
}
