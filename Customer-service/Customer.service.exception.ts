import { OrderItem } from '../Orders/Order/OrderItem.type';

export class CustomerServiceError extends Error {
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
