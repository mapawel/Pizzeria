import { OrderState } from '../Orders/Order/orders-state.enum';
import { OrdersService } from '../Orders/Orders.service';
import { OrderResDTO } from '../Orders/DTO/Order-res.dto';
import { OrderItem } from '../Orders/Order/Order-item.type';
import { KitchenService } from '../Kitchen/Kitchen.service';
import { PizzaIngredientDTO } from '../Kitchen/Pizzas/DTO/Pizza-ingredient.dto';
import { WorkersStore } from '../Workers/Workers.store';
import { WorkerDTO } from '../Workers/DTO/Worker.dto';
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

  public listOrders(ordersType: OrderState): OrderResDTO[] {
    return this.orders.listOrders(ordersType);
  }

  public findOrderById(id: string, orderType: OrderState): OrderResDTO {
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
      OrderState.ORDERS_PENDING
    );

    const ingredients: PizzaIngredientDTO[] =
      this.kitchen.takeIngredientsForOrder(foundOrder.orderItems);

    const cook: WorkerDTO = this.workers.getAvailableCookById(cookId);

    this.workers.updateWorker({
      ...cook,
      isAvailable: false,
    });

    this.kitchen.cookPizzas(ingredients);

    const updatedOrder: OrderResDTO = this.orders.updateOrderCook(
      foundOrder.id,
      cook.id as string,
      OrderState.ORDERS_PENDING
    );

    this.orders.moveOrder(
      updatedOrder.id,
      OrderState.ORDERS_PENDING,
      OrderState.ORDERS_IN_PROGRESS
    );

    return updatedOrder;
  }

  public finishOrder(orderId: string): OrderResDTO {
    const foundOrder: OrderResDTO = this.orders.findOrderById(
      orderId,
      OrderState.ORDERS_IN_PROGRESS
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
      OrderState.ORDERS_IN_PROGRESS,
      OrderState.ORDERS_FINISHED
    );

    return foundOrder;
  }

  public makeOrderTableFree(orderId: string): boolean {
    const foundOrder: OrderResDTO = this.orders.findOrderById(
      orderId,
      OrderState.ORDERS_FINISHED
    );

    if (foundOrder.tableId && foundOrder.tablePerson) {
      return this.tables.makeTableFree(
        foundOrder.tableId as string,
        foundOrder.tablePerson
      );
    }
    return false;
  }
}
