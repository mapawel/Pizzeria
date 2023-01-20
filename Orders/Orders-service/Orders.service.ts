import { OrdersStore } from '../../Orders/Orders-store/Orders.store';
import { KitchenService } from '../../Kitchen-service/Kitchen.service';
import { TablesStore } from '../../Tables/Tables.store';
import { WorkersStore } from '../../Workers/Workers.store';
import { DiscountStore } from '../../Discounts/Discount-store/Discount.store';
import { Order } from '../../Orders/Order/Order.class';
import { OrdersServiceCollections } from '../../Orders/Order/Orders-service.collections.enum';
import { WorkerItem } from '../../Workers/Worker-item.type';
import { TableItem } from '../../Tables/Table-item.type';
import { ProductItem } from '../../Products/Product-item.type';
import { Discount } from '../../Discounts/Discount/Discount.class';
import { IngredientItem } from '../../Kitchen-service/Ingredients/Ingredient-item.type';
import { OrdersServiceError } from './Orders.service.exception';
import { OrderItem } from '../../Orders/Order/Order-item.type';
import { Role } from '../../Workers/Worker/Roles.enum';
import { DiscountService } from '../../Discounts/Discount-service/Discount.service';

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
  ): Order<WorkerItem | null, TableItem | null>[] {
    return Array.from(this.orders[ordersType], ([_, value]) => value);
  }

  public orderToGo(
    preOrdersArr: {
      product: ProductItem;
      qty: number;
    }[],
    discount?: string
  ): Order<WorkerItem, null> {
    const cook: WorkerItem | null = this.workers.findAvailableWorker(Role.cook);
    if (!cook)
      throw new OrdersServiceError(
        'This order cannot be delivered - no cook available.',
        { preOrdersArr, discount }
      );

    const orderItems: OrderItem[] = this.createOrderItems(preOrdersArr);
    const ingredients: IngredientItem[] =
      this.kitchen.takeIngredientsForOrder(orderItems);

    const totalValue: number = this.getTotalOrderValue(orderItems, discount);

    const newOrder = new Order(orderItems, totalValue, cook, null);
    cook.isAvailable = false;
    this.workers.addOrUpdateItem(cook.worker, { isAvailable: false });
    this.kitchen.cookPizzas(ingredients);
    // discountInstance?.useDiscountQty(1); //TODO doscount using
    this.orders.addOrder(newOrder, OrdersServiceCollections.ordersInProgress);
    return newOrder;
  }

  public orderWhReservation(
    preOrdersArr: {
      product: ProductItem;
      qty: number;
    }[],
    tablePerson: number,
    discount?: string
  ): Order<WorkerItem | null, TableItem> {
    const table: TableItem | null = this.tables.findFreeTable(tablePerson);
    if (!table)
      throw new OrdersServiceError(
        'This order cannot be prepared - no a free table available. Check if the customer wants to order to go out.',
        { preOrdersArr, discount, tablePerson }
      );
    table.sitsAvailable = table.sitsAvailable - tablePerson;
    table.isAvailable = false;
    this.tables.addOrUpdateItem(table.table, {
      sitsToReserve: tablePerson,
      isAvailable: false,
    });

    const orderItems: OrderItem[] = this.createOrderItems(preOrdersArr);
    const ingredients: IngredientItem[] =
      this.kitchen.takeIngredientsForOrder(orderItems);
    const totalValue: number = this.getTotalOrderValue(orderItems, discount);

    const cook: WorkerItem | null = this.workers.findAvailableWorker(Role.cook);
    let newOrder;

    if (cook) {
      newOrder = new Order(orderItems, totalValue, cook, table);
      cook.isAvailable = false;
      this.workers.addOrUpdateItem(cook.worker, { isAvailable: false });
      this.kitchen.cookPizzas(ingredients);
      this.orders.addOrder(newOrder, OrdersServiceCollections.ordersInProgress);
    } else {
      newOrder = new Order(orderItems, totalValue, null, table);
      this.orders.addOrder(newOrder, OrdersServiceCollections.ordersPending);
    }
    // discountInstance?.useDiscountQty(1); //TODO discount using
    return newOrder;
  }

  public executePendingOrder(
    order: Order<WorkerItem | null, TableItem>,
    cook: WorkerItem
  ): Order<WorkerItem, TableItem> {
    cook.isAvailable = false;
    this.workers.addOrUpdateItem(cook.worker, { isAvailable: false });

    const ingredients: IngredientItem[] = this.kitchen.takeIngredientsForOrder(
      order.orderItems
    );
    this.kitchen.cookPizzas(ingredients);
    this.orders.deleteOrder(order, OrdersServiceCollections.ordersPending);
    order.cook = cook;
    this.orders.addOrder(order, OrdersServiceCollections.ordersInProgress);
    return order as Order<WorkerItem, TableItem>;
  }

  public finishOrderByCook(
    order: Order<WorkerItem, TableItem | null>
  ): boolean {
    this.workers.addOrUpdateItem(order.cook.worker, { isAvailable: true });
    this.orders.deleteOrder(order, OrdersServiceCollections.ordersInProgress);
    this.orders.addOrder(order, OrdersServiceCollections.ordersFinished);
    return true;
  }

  private createOrderItems(
    preOrdersArr: {
      product: ProductItem;
      qty: number;
    }[]
  ): OrderItem[] {
    return preOrdersArr.map(
      ({ product, qty }: { product: ProductItem; qty: number }) => ({
        product,
        qty,
        unitPrice: product.price,
        value: product.price * qty,
      })
    );
  }

  private getTotalOrderValue(
    orderItems: OrderItem[],
    discount?: string
  ): number {
    const discountPercent: number = discount
      ? this.discounts.getValidDiscountPercent(discount)
      : 0;

    return orderItems.reduce(
      (acc: number, x: OrderItem) => acc + x.value * (1 - discountPercent),
      0
    );
  }
}
