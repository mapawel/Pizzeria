import { OrderToGo } from '../Order/Order-to-go';
import { OrderIn } from '../Order/Order-in';
import { OrdersServiceCollections } from '../Order/Orders-service.collections.enum';
import { OrdersStoreError } from '../exceptions/Orders-store.exception';
import { OrderResDTO } from '../DTO/Order-res.dto';
import { OrderItem } from 'Orders/Order/Order-item.type';

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
    const foundOrder: OrderIn | OrderToGo = this.validateIfExisting(
      id,
      orderType
    );

    return {
      id: foundOrder.id,
      orderItems: foundOrder.orderItems.map((order: OrderItem) => ({
        pizzaNameId: order.pizzaNameId,
        qty: order.qty,
      })),
      totalValue: foundOrder.totalValue,
      cookId: foundOrder.cookId,
      tableNameId:
        foundOrder.orderType === 'in' ? foundOrder.tableNameId : null,
      tablePerson:
        foundOrder.orderType === 'in' ? foundOrder.tablePerson : null,
    };
  }

  public addOrder(
    order: OrderIn | OrderToGo,
    orderType: OrdersServiceCollections
  ): OrderResDTO {
    const updatedMap = this[orderType].set(order.id, order);

    const uptadedOrder: OrderIn | OrderToGo = updatedMap.get(order.id) as
      | OrderIn
      | OrderToGo;

    return {
      id: uptadedOrder.id,
      orderItems: uptadedOrder.orderItems.map((order: OrderItem) => ({
        pizzaNameId: order.pizzaNameId,
        qty: order.qty,
      })),
      totalValue: uptadedOrder.totalValue,
      cookId: uptadedOrder.cookId,
      tableNameId:
        uptadedOrder.orderType === 'in' ? uptadedOrder.tableNameId : null,
      tablePerson:
        uptadedOrder.orderType === 'in' ? uptadedOrder.tablePerson : null,
    };
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
    const foundOrder: OrderToGo | OrderIn = this.validateIfExisting(
      orderId,
      orderType
    );

    const updatedMap = this[orderType].set(foundOrder.id, {
      ...foundOrder,
      cookId,
    });

    const uptadedOrder: OrderIn | OrderToGo = updatedMap.get(foundOrder.id) as
      | OrderIn
      | OrderToGo;

    return {
      id: uptadedOrder.id,
      orderItems: uptadedOrder.orderItems.map((order: OrderItem) => ({
        pizzaNameId: order.pizzaNameId,
        qty: order.qty,
      })),
      totalValue: uptadedOrder.totalValue,
      cookId: uptadedOrder.cookId,
      tableNameId:
        uptadedOrder.orderType === 'in' ? uptadedOrder.tableNameId : null,
      tablePerson:
        uptadedOrder.orderType === 'in' ? uptadedOrder.tablePerson : null,
    };
  }

  public deleteOrder(
    orderId: string,
    orderType: OrdersServiceCollections
  ): boolean {
    const foundOrder = this.validateIfExisting(orderId, orderType);
    this[orderType].delete(foundOrder.id);
    return true;
  }

  private validateIfExisting(
    id: string,
    orderType: OrdersServiceCollections
  ): OrderIn | OrderToGo {
    const foundOrder = this[orderType].get(id);
    if (!foundOrder)
      throw new OrdersStoreError(
        'Order with passed id not found in store, could not proceed.',
        { id }
      );
    return foundOrder;
  }

  private getOrderInstanceById(
    id: string,
    orderType: OrdersServiceCollections
  ): OrderIn | OrderToGo {
    const foundOrderInstance: OrderIn | OrderToGo = this.validateIfExisting(
      id,
      orderType
    );

    return foundOrderInstance;
  }
}
