import { WorkerItem } from '../Workers/WorkerItem.type';
import { KitchenService } from '../Kitchen/Kitchen-service';
import { TablesStore } from '../Tables/Tables-store.class';
import { WorkersStore } from '../Workers/Workers-store.class';
import { Order } from '../Orders/Order/Order.class';
import { TableItem } from '../Tables/TableItem.type';
import { Role } from '../Workers/Worker/Roles.enum';
import { ProductItem } from '../Products/ProductItem.type';
import { OrderItem } from '../Orders/Order/OrderItem.type';
import { IngredientItem } from 'Kitchen/Ingredients/Ingredient-item.type';
import { ServiceError } from '../Orders/Order/Service.exception';
import { DiscountStore } from '../Discounts/Discount-store.class';
import { OrdersService } from '../Orders/Orders-service.class';
import { OrdersServiceCollections } from '../Orders/Order/Orders-service.collections.enum';
import { ProductsStore } from '../Products/Products-store';
import { PizzaItem } from '../Kitchen/Pizzas/PizzaItem.type';
import { Discount } from 'Discounts/Discount/Discount.class';

export class Service {
  static instance: Service | null;
  private readonly kitchen: KitchenService;
  private readonly tables: TablesStore;
  private readonly workers: WorkersStore;
  private readonly orders: OrdersService;
  private readonly discounts: DiscountStore;
  private readonly products: ProductsStore;

  private constructor() {
    this.kitchen = KitchenService.getInstance();
    this.tables = TablesStore.getInstance();
    this.workers = WorkersStore.getInstance();
    this.orders = OrdersService.getInstance();
    this.discounts = DiscountStore.getInstance();
    this.products = ProductsStore.getInstance();
  }

  public static getInstance() {
    if (Service.instance) return Service.instance;
    return (Service.instance = new Service());
  }

  public static resetInstance() {
    Service.instance = null;
  }

  public getMenu(): ProductItem[] {
    return [...this.products.getProductArr()];
  }

  public listOrders(
    ordersType: OrdersServiceCollections
  ): Order<WorkerItem, WorkerItem | null, TableItem | null>[] {
    return Array.from(this.orders[ordersType], ([_, value]) => value);
  }

  public orderToGo(
    preOrdersArr: {
      product: ProductItem;
      qty: number;
    }[],
    discount?: string
  ): Order<null, WorkerItem, null> {
    let discountInstance: Discount | null = null;
    if (discount) discountInstance = this.discounts.findItemById(discount);
    const discountPercent: number = discountInstance?.discountPercent || 0;
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
    discountInstance?.useDiscountQty(1);
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
  ): Order<null, WorkerItem | null, TableItem> {
    let discountInstance: Discount | null = null;
    if (discount) discountInstance = this.discounts.findItemById(discount);
    const discountPercent: number = discountInstance?.discountPercent || 0;
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

    const cook: WorkerItem | null = this.workers.findAvailableWorker(Role.cook);
    let newOrder;

    if (cook) {
      newOrder = new Order(orderItems, totalValue, cook, table);
      cook.isAvailable = false;
      this.workers.addOrUpdateItem(cook.worker, false);
      this.kitchen.cookPizzas(ingredients);
      this.orders.addOrder(newOrder, OrdersServiceCollections.ordersInProgress);
      discountInstance?.useDiscountQty(1);
      return newOrder;
    } else {
      newOrder = new Order(orderItems, totalValue, null, table);
      this.orders.addOrder(newOrder, OrdersServiceCollections.ordersPending);
      discountInstance?.useDiscountQty(1);
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
    this.orders.deleteOrder(order, OrdersServiceCollections.ordersPending);
    order.cook = cook;
    this.orders.addOrder(order, OrdersServiceCollections.ordersInProgress);
    return order as Order<null, WorkerItem, TableItem>;
  }

  public finishOrderByCook(
    order: Order<WorkerItem, WorkerItem, TableItem | null>
  ): boolean {
    this.workers.addOrUpdateItem(order.cook.worker, true);
    this.orders.deleteOrder(order, OrdersServiceCollections.ordersInProgress);
    this.orders.addOrder(order, OrdersServiceCollections.ordersFinished);
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
