import { OrderToGo } from '../Order/Order-to-go';
import { OrderIn } from '../Order/Order-in';
import { OrdersServiceCollections } from '../Order/Orders-service.collections.enum';
import { OrdersStoreError } from '../exceptions/Orders-store.exception';
import { OrderResDTO } from '../DTO/Order-res.dto';
import { OrderItem } from '../Order/Order-item.type';
import { OrderDTOMapper } from '../DTO/Order-dto.mapper';

export class OrdersStore {
  private static instance: OrdersStore | null;
  private readonly ordersPending: Map<string, OrderIn | OrderToGo> = new Map();
  private readonly ordersInProgress: Map<string, OrderIn | OrderToGo> =
    new Map();
  private readonly ordersFinished: Map<string, OrderIn | OrderToGo> = new Map();

  private constructor() {}

  public static getInstance() {
    if (OrdersStore.instance) return OrdersStore.instance;
    return (OrdersStore.instance = new OrdersStore());
  }

  public static resetInstance() {
    OrdersStore.instance = null;
  }

  public findOrderById(
    id: string,
    orderType: OrdersServiceCollections
  ): OrderResDTO {
    const foundOrder: OrderIn | OrderToGo = this.getIfExisting(id, orderType);

    return OrderDTOMapper.mapToResDTO(foundOrder);
  }

  public addOrder(
    order: OrderIn | OrderToGo,
    orderType: OrdersServiceCollections
  ): OrderResDTO {
    this[orderType].set(order.id, order);

    return OrderDTOMapper.mapToResDTO(order);
  }

  public moveOrder(
    orderId: string,
    prevCollection: OrdersServiceCollections,
    targetCollection: OrdersServiceCollections
  ): boolean {
    const foundOrderInstance: OrderIn | OrderToGo = this.getOrderInstanceById(
      orderId,
      prevCollection
    );

    this[prevCollection].delete(foundOrderInstance.id);
    this[targetCollection].set(foundOrderInstance.id, foundOrderInstance);
    return true;
  }

  public updateOrderCook(
    orderId: string,
    cookId: string,
    orderType: OrdersServiceCollections
  ): OrderResDTO {
    const foundOrder: OrderToGo | OrderIn = this.getIfExisting(
      orderId,
      orderType
    );

    const updatedOrder: OrderIn | OrderToGo = { ...foundOrder, cookId };

    this[orderType].set(foundOrder.id, updatedOrder);

    return OrderDTOMapper.mapToResDTO(updatedOrder);
  }

  public removeOrder(
    orderId: string,
    orderType: OrdersServiceCollections
  ): boolean {
    const result: boolean = this[orderType].delete(orderId);
    if (!result) this.throwValidateError(orderId);
    return true;
  }

  private throwValidateError(id: string): void {
    throw new OrdersStoreError(
      'Order with passed id not found in store, could not proceed.',
      { id }
    );
  }

  private getIfExisting(
    id: string,
    orderType: OrdersServiceCollections
  ): OrderIn | OrderToGo {
    const foundOrder = this[orderType].get(id);
    if (!foundOrder) this.throwValidateError(id);
    return foundOrder as OrderIn | OrderToGo;
  }

  private getOrderInstanceById(
    id: string,
    orderType: OrdersServiceCollections
  ): OrderIn | OrderToGo {
    const foundOrderInstance: OrderIn | OrderToGo = this.getIfExisting(
      id,
      orderType
    );

    return foundOrderInstance;
  }
}
