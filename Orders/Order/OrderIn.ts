import { v4 as uuidv4 } from 'uuid';
import { OrderItem } from './OrderItem.type';
import { OrderToGo } from './OrderToGo';

export class OrderIn extends OrderToGo {
  readonly id: string;

  public constructor(
    orderItems: OrderItem[],
    totalValue: number,
    cookId: string,
    public tableId: string
  ) {
    super(orderItems, totalValue, cookId);
    this.id = uuidv4();
  }
}
