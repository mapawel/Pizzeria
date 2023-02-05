import { OrdersServiceCollections } from '../Orders/Order/Orders-service.collections.enum';
import { OrdersService } from '../Orders/Orders.service';
import { OrderResDTO } from '../Orders/DTO/OrderRes.dto';
import { OrderItem } from '../Orders/Order/OrderItem.type';
import { KitchenService } from '../Kitchen/Kitchen.service';
import { PizzaIngredientDTO } from '../Kitchen/Pizzas/DTO/PizzaIngredient.dto';
import { WorkersStore } from '../Workers/Workers.store';
import { WorkerDTO } from '../Workers/DTO/WorkerDTO';
import { TablesService } from '../Tables/Tables.service';

export class CustomerService {
  private static instance: CustomerService | null;
  private readonly orders: OrdersService;
  private readonly kitchen: KitchenService;
  private readonly workers: WorkersStore;
  private readonly tables: TablesService;

  private constructor() {
    this.orders = OrdersService.getInstance();
    this.kitchen = KitchenService.getInstance();
    this.workers = WorkersStore.getInstance();
    this.tables = TablesService.getInstance();
  }

  public static getInstance() {
    if (CustomerService.instance) return CustomerService.instance;
    return (CustomerService.instance = new CustomerService());
  }

  public static resetInstance() {
    CustomerService.instance = null;
  }

  public listOrders(ordersType: OrdersServiceCollections): OrderResDTO[] {
    return this.orders.listOrders(ordersType);
  }

  public findOrderById(
    id: string,
    orderType: OrdersServiceCollections
  ): OrderResDTO {
    return this.orders.findOrderById(id, orderType);
  }

  public orderToGo(preOrdersArr: OrderItem[], discount?: string): OrderResDTO {
    return this.orders.orderToGo(preOrdersArr, discount);
  }

  public orderIn(
    preOrdersArr: OrderItem[],
    tablePerson: number,
    discount?: string
  ): OrderResDTO {
    return this.orders.orderIn(preOrdersArr, tablePerson, discount);
  }

  public executePendingOrder(orderId: string, cookId: string): OrderResDTO {
    const foundOrder: OrderResDTO = this.orders.findOrderById(
      orderId,
      OrdersServiceCollections.ORDERS_PENDING
    );

    const ingredients: PizzaIngredientDTO[] =
      this.kitchen.takeIngredientsForOrder(foundOrder.orderItems);

    const cook: WorkerDTO = this.workers.findAvailableCookById(cookId);

    this.workers.updateWorker({
      ...cook,
      isAvailable: false,
    });

    this.kitchen.cookPizzas(ingredients);

    const updatedOrder: OrderResDTO = this.orders.updateOrderCook(
      foundOrder.id,
      cook.id as string,
      OrdersServiceCollections.ORDERS_PENDING
    );

    this.orders.moveOrder(
      updatedOrder.id,
      OrdersServiceCollections.ORDERS_PENDING,
      OrdersServiceCollections.ORDERS_IN_PROGRESS
    );

    return {
      id: updatedOrder.id,
      orderItems: updatedOrder.orderItems.map((order: OrderItem) => ({
        pizzaNameId: order.pizzaNameId,
        qty: order.qty,
      })),
      totalValue: updatedOrder.totalValue,
      cookId: updatedOrder.cookId,
      tableNameId: updatedOrder.tableNameId,
      tablePerson: updatedOrder.tablePerson,
    };
  }

  public finishOrder(orderId: string): OrderResDTO {
    const foundOrder: OrderResDTO = this.orders.findOrderById(
      orderId,
      OrdersServiceCollections.ORDERS_IN_PROGRESS
    );
    const cook: WorkerDTO = this.workers.findWorker(
      foundOrder.cookId as string
    );
    this.workers.updateWorker({
      ...cook,
      isAvailable: true,
    });

    this.orders.moveOrder(
      orderId,
      OrdersServiceCollections.ORDERS_IN_PROGRESS,
      OrdersServiceCollections.ORDERS_FINISHED
    );

    return {
      id: foundOrder.id,
      orderItems: foundOrder.orderItems.map((order: OrderItem) => ({
        pizzaNameId: order.pizzaNameId,
        qty: order.qty,
      })),
      totalValue: foundOrder.totalValue,
      cookId: foundOrder.cookId,
      tableNameId: foundOrder.tableNameId,
      tablePerson: foundOrder.tablePerson,
    };
  }

  public makeOrderTableFree(orderId: string): boolean {
    const foundOrder: OrderResDTO = this.orders.findOrderById(
      orderId,
      OrdersServiceCollections.ORDERS_FINISHED
    );

    if (foundOrder.tableNameId && foundOrder.tablePerson) {
      return this.tables.makeTableFree(
        foundOrder.tableNameId as string,
        foundOrder.tablePerson
      );
    }
    return false;
  }
}
