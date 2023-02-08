import { v4 as uuidv4 } from 'uuid';
import { OrderItem } from './Order-item.type';
import { OrderType } from './Order-type.enum';

export class OrderIn {
  readonly id: string;
  readonly orderType = OrderType.IN;

  public constructor(
    readonly orderItems: OrderItem[],
    readonly totalValue: number,
    public cookId: string | null,
    public tableId: string,
    public tablePerson: number
  ) {
    this.id = uuidv4();
  }
}
