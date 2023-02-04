import { OrderItem } from '../Order/OrderItem.type';

export class OrdersServiceError extends Error {
  constructor(
    readonly message: string,
    readonly payload?: {
      preOrdersArr: OrderItem[];
      discount?: string;
      tablePerson?: number;
    }
  ) {
    super(message);
  }
}
