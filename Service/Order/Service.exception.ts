import { OrderItem } from './OrderItem.type';

export class ServiceError extends Error {
  constructor(
    readonly message: string,
    readonly payload?: { preOrdersArr: OrderItem[] }
  ) {
    super(message);
  }
}
