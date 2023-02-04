import { OrdersStore } from './Orders-store/Orders.store';
import { OrderIn } from './Order/OrderIn';
import { OrderToGo } from './Order/OrderToGo';
import { KitchenService } from '../Kitchen/Kitchen.service';
import { TablesStore } from '../Tables/Tables.store';
import { WorkersStore } from '../Workers/Workers.store';
import { OrdersServiceCollections } from './Order/Orders-service.collections.enum';
import { OrdersServiceError } from './exceptions/Orders.service.exception';
import { OrderItem } from './Order/OrderItem.type';
import { Role } from '../Workers/Worker/Roles.enum';
import { DiscountService } from '../Discounts/Discount.service';
import { OrderResDTO } from './DTO/OrderRes.dto';
import { WorkerDTO } from 'Workers/DTO/WorkerDTO';
import { PizzaResDTO } from 'Kitchen/Pizzas/DTO/PizzaRes.dto';
import { PizzaIngredientDTO } from 'Kitchen/Pizzas/DTO/PizzaIngredient.dto';
import { TableDTO } from 'Tables/DTO/Table.dto';

export class OrdersService {
  private static instance: OrdersService | null;
  private readonly kitchen: KitchenService;
  private readonly tables: TablesStore;
  private readonly workers: WorkersStore;
  private readonly orders: OrdersStore;
  private readonly discounts: DiscountService;

  private constructor() {
    this.kitchen = KitchenService.getInstance();
    this.tables = TablesStore.getInstance();
    this.workers = WorkersStore.getInstance();
    this.orders = OrdersStore.getInstance();
    this.discounts = DiscountService.getInstance();
  }

  public static getInstance() {
    if (OrdersService.instance) return OrdersService.instance;
    return (OrdersService.instance = new OrdersService());
  }

  public static resetInstance() {
    OrdersService.instance = null;
  }

  public listOrders(
    ordersType: OrdersServiceCollections
  ): (OrderIn | OrderToGo)[] {
    return Array.from(this.orders[ordersType], ([_, value]) => value);
    //TODO OrderDTO
  }
  public findOrderById(
    id: string,
    orderType: OrdersServiceCollections
  ): OrderResDTO {
    return this.orders.findOrderById(id, orderType);
  }

  public updateOrderCook(
    orderId: string,
    cookId: string,
    orderType: OrdersServiceCollections
  ): OrderResDTO {
    return this.orders.updateOrderCook(orderId, cookId, orderType);
  }

  public moveOrder(
    orderId: string,
    prevCollection: OrdersServiceCollections,
    targetCollection: OrdersServiceCollections
  ): boolean {
    return this.orders.moveOrder(orderId, prevCollection, targetCollection);
  }

  public orderToGo(preOrdersArr: OrderItem[], discount?: string): OrderResDTO {
    const cook: WorkerDTO | null = this.workers.findAvailableWorker(Role.COOK);
    if (!cook?.id)
      throw new OrdersServiceError(
        'This order cannot be delivered - no cook available.',
        { preOrdersArr, discount }
      );

    const ingredients: PizzaIngredientDTO[] =
      this.kitchen.takeIngredientsForOrder(preOrdersArr);

    const totalValue: number = this.getTotalOrderValue(preOrdersArr, discount);

    this.workers.updateWorker({
      ...cook,
      isAvailable: false,
    });

    const newOrder = new OrderToGo(preOrdersArr, totalValue, cook.id);

    this.kitchen.cookPizzas(ingredients);
    if (discount)
      this.discounts.useLimitedDiscount(
        discount,
        this.getTotalPizzasQty(preOrdersArr)
      );
    this.orders.addOrder(newOrder, OrdersServiceCollections.ORDERS_IN_PROGRESS);

    return {
      id: newOrder.id,
      orderItems: newOrder.orderItems.map((order: OrderItem) => ({
        pizzaNameId: order.pizzaNameId,
        qty: order.qty,
      })),
      totalValue: newOrder.totalValue,
      cookId: newOrder.cookId,
      tableNameId: null,
      tablePerson: null,
    };
  }

  public orderIn(
    preOrdersArr: OrderItem[],
    tablePerson: number,
    discount?: string
  ): OrderResDTO {
    const table: TableDTO | null = this.tables.findFreeTable(tablePerson);
    if (!table)
      throw new OrdersServiceError(
        'This order cannot be prepared - no a free table available. Check if the customer wants to order to go out.',
        { preOrdersArr, discount, tablePerson }
      );

    this.tables.updateTable({
      ...table,
      isAvailable: false,
      sitsAvailable: table.sitsAvailable - tablePerson,
    });

    const ingredients: PizzaIngredientDTO[] =
      this.kitchen.takeIngredientsForOrder(preOrdersArr);

    const totalValue: number = this.getTotalOrderValue(preOrdersArr, discount);

    const cook: WorkerDTO | null = this.workers.findAvailableWorker(Role.COOK);
    let newOrder;

    if (cook?.id) {
      this.workers.updateWorker({
        ...cook,
        isAvailable: false,
      });
      newOrder = new OrderIn(
        preOrdersArr,
        totalValue,
        cook.id,
        table.nameId,
        tablePerson
      );
      this.kitchen.cookPizzas(ingredients);
      this.orders.addOrder(
        newOrder,
        OrdersServiceCollections.ORDERS_IN_PROGRESS
      );
    } else {
      newOrder = new OrderIn(
        preOrdersArr,
        totalValue,
        null,
        table.nameId,
        tablePerson
      );
      this.orders.addOrder(newOrder, OrdersServiceCollections.ORDERS_PENDING);
    }
    if (discount)
      this.discounts.useLimitedDiscount(
        discount,
        this.getTotalPizzasQty(preOrdersArr)
      );
    return {
      id: newOrder.id,
      orderItems: newOrder.orderItems.map((order: OrderItem) => ({
        pizzaNameId: order.pizzaNameId,
        qty: order.qty,
      })),
      totalValue: newOrder.totalValue,
      cookId: newOrder.cookId,
      tableNameId: newOrder.tableNameId,
      tablePerson: newOrder.tablePerson,
    };
  }

  private getTotalOrderValue(
    orderItems: OrderItem[],
    discount?: string
  ): number {
    const discountPercent: number = discount
      ? this.discounts.getValidDiscountPercent(
          discount,
          this.getTotalPizzasQty(orderItems)
        )
      : 0;

    return orderItems.reduce((acc: number, x: OrderItem) => {
      const product: PizzaResDTO = this.kitchen.findPizzaById(x.pizzaNameId);
      return acc + product.price * x.qty * (1 - discountPercent);
    }, 0);
  }

  private getTotalPizzasQty(orderItems: OrderItem[]): number {
    return orderItems.reduce((acc: number, x: OrderItem) => acc + x.qty, 0);
  }
}
