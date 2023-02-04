import { WorkersStore } from '../Workers/Workers.store';
import { TablesStore } from '../Tables/Tables.store';
import { OrdersServiceCollections } from '../Orders/Order/Orders-service.collections.enum';
import { KitchenService } from '../Kitchen/Kitchen.service';
import { OrdersService } from '../Orders/Orders.service';
import { PizzaIngredientDTO } from '../Kitchen/Pizzas/DTO/PizzaIngredient.dto';
import { OrderResDTO } from '../Orders/DTO/OrderRes.dto';
import { WorkerDTO } from '../Workers/DTO/WorkerDTO';
import { OrderItem } from '../Orders/Order/OrderItem.type';
import { TableDTO } from 'Tables/DTO/Table.dto';

export class BackofficeService {
  private static instance: BackofficeService | null;
  private readonly workers: WorkersStore;
  private readonly tables: TablesStore;
  private readonly kitchen: KitchenService;
  private readonly orders: OrdersService;

  private constructor() {
    this.workers = WorkersStore.getInstance();
    this.tables = TablesStore.getInstance();
    this.kitchen = KitchenService.getInstance();
    this.orders = OrdersService.getInstance();
  }

  public static getInstance() {
    if (BackofficeService.instance) return BackofficeService.instance;
    return (BackofficeService.instance = new BackofficeService());
  }

  public static resetInstance() {
    BackofficeService.instance = null;
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

  public makeTableFree(orderId: string): boolean {
    const foundOrder: OrderResDTO = this.orders.findOrderById(
      orderId,
      OrdersServiceCollections.ORDERS_FINISHED
    );

    if (foundOrder.tableNameId && foundOrder.tablePerson) {
      const table: TableDTO = this.tables.findTableByNameId(
        foundOrder.tableNameId as string
      );

      this.tables.updateTable({
        ...table,
        sitsAvailable: table.sitsAvailable + foundOrder.tablePerson,
        isAvailable: true,
      });

      return true;
    }
    return false;
  }
}
