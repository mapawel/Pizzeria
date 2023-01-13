import { Order } from './Order/Order.class';
import { WorkerItem } from 'Workers/WorkerItem.type';
import { TableItem } from 'Tables/TableItem.type';
import { OrdersServiceCollections } from './Order/Orders-service.collections.enum';

export class OrdersServiceError extends Error {
  constructor(
    readonly message: string,
    readonly payload?: {
      order?: Order<WorkerItem, WorkerItem | null, TableItem | null>;
      orderType?: OrdersServiceCollections;
    }
  ) {
    super(message);
  }
}
