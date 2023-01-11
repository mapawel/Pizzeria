import { WorkerItem } from '../Workers/WorkerItem.type';
import { KitchenService } from '../Kitchen/Kitchen-service';
import { TablesStore } from '../Tables/Tables-store.class';
import { WorkersStore } from '../Workers/Workers-store.class';
import { Order } from './Order/Order.class';
import { TableItem } from '../Tables/TableItem.type';
import { Role } from '../Workers/Worker/Roles.enum';
import { ProductItem } from '../Products-service/ProductItem.type';
import { OrderItem } from './Order/OrderItem.type';
import { IngredientItem } from 'Kitchen/Ingredients-store/Ingredient-item.type';
import { ServiceError } from './Order/Service.exception';
import { DiscountStore } from '../Discounts-store/Discount-store.class';

export class Service {
  static instance: Service | null;
  private readonly kitchen: KitchenService;
  private readonly tables: TablesStore;
  private readonly workers: WorkersStore;
  private readonly ordersPending: Map<
    string,
    Order<WorkerItem, null, TableItem | null>
  > = new Map();
  private readonly ordersInProgress: Map<
    string,
    Order<WorkerItem, WorkerItem, TableItem | null>
  > = new Map();
  private readonly ordersFinished: Map<
    string,
    Order<WorkerItem, WorkerItem, TableItem | null>
  > = new Map();
  private readonly discounts: DiscountStore;

  private constructor() {
    this.kitchen = KitchenService.getInstance();
    this.tables = TablesStore.getInstance();
    this.workers = WorkersStore.getInstance();
    this.discounts = DiscountStore.getInstance();
  }

  public static getInstance() {
    if (Service.instance) return Service.instance;
    return (Service.instance = new Service());
  }

  public static resetInstance() {
    Service.instance = null;
  }
  // to REMOVE
  public testProgress(): Map<
    string,
    Order<WorkerItem, WorkerItem, TableItem | null>
  > {
    return new Map(this.ordersInProgress);
  }
  public testFinished(): Map<
    string,
    Order<WorkerItem, WorkerItem, TableItem | null>
  > {
    return new Map(this.ordersFinished);
  }
  public testToPrepare(): Map<
    string,
    Order<WorkerItem, WorkerItem | null, TableItem | null>
  > {
    return new Map(this.ordersPending);
  }
  //------

  public orderToGo(
    preOrdersArr: {
      product: ProductItem;
      qty: number;
    }[],
    discount?: string
  ): Order<null, WorkerItem, null> {
    const discountPercent: number = discount
      ? this.discounts.findItemById(discount).discountPercent
      : 0;
    const cook: WorkerItem | null = this.workers.findAvailableWorker(Role.cook);
    if (!cook)
      throw new ServiceError(
        'This order cannot be delivered - no cook available.',
        { preOrdersArr, discount }
      );
    const orderItems: OrderItem[] = this.createOrderItems(
      preOrdersArr,
      discountPercent
    );
    const ingredients: IngredientItem[] =
      this.kitchen.takeIngredientsForOrder(orderItems);
    const totalValue: number = orderItems.reduce(
      (acc: number, x: OrderItem) => acc + x.value,
      0
    );
    const newOrder = new Order(orderItems, totalValue, cook, null);
    cook.isAvailable = false;
    this.workers.addOrUpdateItem(cook.worker, false);
    this.kitchen.cookPizzas(ingredients);
    this.ordersInProgress.set(newOrder.id, newOrder);
    return newOrder;
  }

  public orderWhReservation(
    preOrdersArr: {
      product: ProductItem;
      qty: number;
    }[],
    tablePerson: number,
    discount?: string,
  ): Order<null, WorkerItem | null, TableItem> {
    const discountPercent: number = discount
      ? this.discounts.findItemById(discount).discountPercent
      : 0;
    const table: TableItem | null = this.tables.findFreeTable(tablePerson);
    if (!table)
      throw new ServiceError(
        'This order cannot be prepared - no a free table available. Check if the customer wants to order to go out.',
        { preOrdersArr, discount, tablePerson }
      );
    table.sitsAvailable = table.sitsAvailable - tablePerson;
    table.isAvailable = false;
    this.tables.addOrUpdateItem(table.table, tablePerson, false);

    const orderItems: OrderItem[] = this.createOrderItems(
      preOrdersArr,
      discountPercent
    );
    const ingredients: IngredientItem[] =
      this.kitchen.takeIngredientsForOrder(orderItems);
    const totalValue: number = orderItems.reduce(
      (acc: number, x: OrderItem) => acc + x.value,
      0
    );

    const cook: WorkerItem | null = this.workers.findAvailableWorker(Role.cook); // it will work without a cook
    let newOrder;

    if (cook) {
      newOrder = new Order(orderItems, totalValue, cook, table);
      cook.isAvailable = false;
      this.workers.addOrUpdateItem(cook.worker, false);

      this.kitchen.cookPizzas(ingredients);
      this.ordersInProgress.set(newOrder.id, newOrder);
      return newOrder;
    } else {
      newOrder = new Order(orderItems, totalValue, null, table);
      this.ordersPending.set(newOrder.id, newOrder);
      return newOrder;
    }
  }

  public executePendingOrder(
    order: Order<WorkerItem, WorkerItem | null, TableItem>,
    cook: WorkerItem
  ): Order<WorkerItem, WorkerItem, TableItem> {
    cook.isAvailable = false;
    this.workers.addOrUpdateItem(cook.worker, false);

    const ingredients: IngredientItem[] = this.kitchen.takeIngredientsForOrder(
      order.orderItems
    );
    this.kitchen.cookPizzas(ingredients);

    this.ordersPending.delete(order.id);
    order.cook = cook;
    this.ordersInProgress.set(
      order.id,
      order as Order<null, WorkerItem, TableItem>
    );
    return order as Order<null, WorkerItem, TableItem>;
  }

  public finishOrderByCook(
    order: Order<WorkerItem, WorkerItem, TableItem | null>
  ): boolean {
    this.workers.addOrUpdateItem(order.cook.worker, true);
    this.ordersInProgress.delete(order.id);
    this.ordersFinished.set(order.id, order);
    return true;
  }

  public makeTableFree(
    order: Order<WorkerItem, WorkerItem | null, TableItem>
  ): boolean {
    this.tables.addOrUpdateItem(order.table.table, 0, true);
    return true;
  }

  private createOrderItems(
    preOrdersArr: {
      product: ProductItem;
      qty: number;
    }[],
    discount: number
  ): OrderItem[] {
    return preOrdersArr.map(
      ({ product, qty }: { product: ProductItem; qty: number }) => ({
        product,
        qty,
        unitPrice: product.price * (1 - discount),
        value: product.price * qty * (1 - discount),
      })
    );
  }
}
