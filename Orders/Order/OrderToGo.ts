import { v4 as uuidv4 } from 'uuid';
import { OrderItem } from './OrderItem.type';

export class OrderToGo {
  readonly id: string;

  public constructor(
    readonly orderItems: OrderItem[],
    readonly totalValue: number,
    public cookId: string
  ) {
    this.id = uuidv4();
  }
}
