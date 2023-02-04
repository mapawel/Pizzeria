import { OrderItem } from '../Order/OrderItem.type';

export class OrdersServiceError extends Error {
  constructor(
    readonly message: string,
    readonly payload?: {
      preOrdersArr: {
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
