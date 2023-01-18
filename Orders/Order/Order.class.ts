import { v4 as uuidv4 } from 'uuid';
import { OrderItem } from './Order-item.type';

export class Order<SellerType, CookType, TableType> {
  readonly id: string;

  public constructor(
    readonly orderItems: OrderItem[],
    readonly totalValue: number,
    // readonly seller: SellerType,
    public cook: CookType,
    readonly table: TableType
  ) {
    this.id = uuidv4();
  }
}
