import { v4 as uuidv4 } from 'uuid';
import { OrderItem } from './Order-item.type';

export class Order<CookType, TableType> {
  readonly id: string;

  public constructor(
    readonly orderItems: OrderItem[],
    readonly totalValue: number,
    public cook: CookType,
    readonly table: TableType
  ) {
    this.id = uuidv4();
  }
}
