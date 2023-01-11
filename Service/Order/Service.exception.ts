import { OrderItem } from './OrderItem.type';
import { ProductItem } from '../../Products-service/ProductItem.type';

export class ServiceError extends Error {
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
