import { OrderItem } from '../Order/Order-item.type';

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
