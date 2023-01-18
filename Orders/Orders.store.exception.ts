import { Order } from './Order/Order.class';
import { WorkerItem } from 'Workers/Worker-item.type';
import { TableItem } from 'Tables/Table-item.type';
import { OrdersServiceCollections } from './Order/Orders-service.collections.enum';

export class OrdersStoreError extends Error {
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
