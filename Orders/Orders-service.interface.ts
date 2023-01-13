import { WorkerItem } from '../Workers/WorkerItem.type';
import { Order } from './Order/Order.class';
import { TableItem } from '../Tables/TableItem.type';
import { OrdersServiceCollections } from './Order/Orders-service.collections.enum';

export interface IOrdersService {
  addOrder(
    order: Order<WorkerItem, WorkerItem | null, TableItem | null>,
    orderType: OrdersServiceCollections
  ): boolean;

  deleteOrder(
    order: Order<WorkerItem, WorkerItem | null, TableItem | null>,
    orderType: OrdersServiceCollections
  ): boolean;
}
