import { OrderItem } from '../Orders/Order/Order-item.type';
import { ProductItem } from '../Products/Product-item.type';

export class CustomerServiceError extends Error {
  constructor(
    readonly message: string,
    readonly payload?: {
      preOrdersArr:
        | OrderItem[]
        | {
            product: ProductItem;
            qty: number;
          }[];
      discount?: string;
      tablePerson?: number;
    }
  ) {
    super(message);
  }
}
