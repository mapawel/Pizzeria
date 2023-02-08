import { v4 as uuidv4 } from 'uuid';
import { OrderItem } from './Order-item.type';
import { OrderType } from './Order-type.enum';

export class OrderToGo {
  readonly id: string;
  readonly orderType = OrderType.TOGO;

  public constructor(
    readonly orderItems: OrderItem[],
    readonly totalValue: number,
    public cookId: string
  ) {
    this.id = uuidv4();
  }
}
