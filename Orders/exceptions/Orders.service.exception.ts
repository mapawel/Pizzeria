import { OrderItem } from '../Order/OrderItem.type';
import { ProductItem } from '../../Products/Product-item.type';

export class OrdersServiceError extends Error {
  constructor(
    readonly message: string,
    readonly payload?: {
      preOrdersArr:
        | OrderItem[]
        | {
            productNameId: string;
            qty: number;
          }[];
      discount?: string;
      tablePerson?: number;
    }
  ) {
    super(message);
  }
}
