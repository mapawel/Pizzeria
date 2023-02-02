import { Order } from '../Order/OrderToGo';
import { WorkerItem } from 'Workers/Worker-item.type';
import { TableItem } from 'Tables/Table-item.type';
import { OrdersServiceCollections } from '../Order/Orders-service.collections.enum';

export class OrdersStoreError extends Error {
  constructor(
    readonly message: string,
    readonly payload?: {
      nameId?: string;
      order?: Order<WorkerItem | null, TableItem | null>;
      orderType?: OrdersServiceCollections;
    }
  ) {
    super(message);
  }
}
