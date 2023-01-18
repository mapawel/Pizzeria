import { WorkerItem } from '../Workers/Worker-item.type';
import { KitchenService } from '../Kitchen-service/Kitchen.service';
import { TablesStore } from '../Tables/Tables.store';
import { WorkersStore } from '../Workers/Workers.store';
import { Order } from '../Orders/Order/Order.class';
import { TableItem } from '../Tables/Table-item.type';
import { Role } from '../Workers/Worker/Roles.enum';
import { ProductItem } from '../Products/Product-item.type';
import { OrderItem } from '../Orders/Order/Order-item.type';
import { IngredientItem } from 'Kitchen-service/Ingredients/Ingredient-item.type';
import { CustomerServiceError } from './Customer.service.exception';
import { DiscountStore } from '../Discounts/Discount.store';
import { OrdersStore } from '../Orders/Orders.store';
import { OrdersServiceCollections } from '../Orders/Order/Orders-service.collections.enum';
import { ProductsStore } from '../Products/Products.store';
import { Discount } from '../Discounts/Discount/Discount.class';

export class CustomerService {
  private static instance: CustomerService | null;
  private readonly kitchen: KitchenService;
  private readonly tables: TablesStore;
  private readonly workers: WorkersStore;
  private readonly orders: OrdersStore;
  private readonly discounts: DiscountStore;
  private readonly products: ProductsStore;

  private constructor() {
    this.kitchen = KitchenService.getInstance();
    this.tables = TablesStore.getInstance();
    this.workers = WorkersStore.getInstance();
    this.orders = OrdersStore.getInstance();
    this.discounts = DiscountStore.getInstance();
    this.products = ProductsStore.getInstance();
  }

  public static getInstance() {
    if (CustomerService.instance) return CustomerService.instance;
    return (CustomerService.instance = new CustomerService());
  }

  public static resetInstance() {
    CustomerService.instance = null;
  }

  public getMenu(): ProductItem[] {
    return [...this.products.getProductArr()];
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
    let discountInstance: Discount | null = null;
    if (discount) discountInstance = this.discounts.findItemById(discount);
    const discountPercent: number = discountInstance?.discountPercent || 0;

    const cook: WorkerItem | null = this.workers.findAvailableWorker(Role.cook);
    if (!cook)
      throw new CustomerServiceError(
        'This order cannot be delivered - no cook available.',
        { preOrdersArr, discount }
      );

    const orderItems: OrderItem[] = this.createOrderItems(
      preOrdersArr,
      discountPercent
    );
    const ingredients: IngredientItem[] =
      this.kitchen.takeIngredientsForOrder(orderItems);
    const totalValue: number = this.getTotalOrderValue(orderItems);

    const newOrder = new Order(orderItems, totalValue, cook, null);
    cook.isAvailable = false;
    this.workers.addOrUpdateItem(cook.worker, { isAvailable: false });
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
  ): Order<WorkerItem | null, TableItem> {
    let discountInstance: Discount | null = null;
    if (discount) discountInstance = this.discounts.findItemById(discount);
    const discountPercent: number = discountInstance?.discountPercent || 0;
    const table: TableItem | null = this.tables.findFreeTable(tablePerson);
    if (!table)
      throw new CustomerServiceError(
        'This order cannot be prepared - no a free table available. Check if the customer wants to order to go out.',
        { preOrdersArr, discount, tablePerson }
      );
    table.sitsAvailable = table.sitsAvailable - tablePerson;
    table.isAvailable = false;
    this.tables.addOrUpdateItem(table.table, {
      sitsToReserve: tablePerson,
      isAvailable: false,
    });

    const orderItems: OrderItem[] = this.createOrderItems(
      preOrdersArr,
      discountPercent
    );
    const ingredients: IngredientItem[] =
      this.kitchen.takeIngredientsForOrder(orderItems);
    const totalValue: number = this.getTotalOrderValue(orderItems);

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
    discountInstance?.useDiscountQty(1);
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

  public makeTableFree(order: Order<WorkerItem | null, TableItem>): boolean {
    this.tables.addOrUpdateItem(order.table.table, {
      sitsToReserve: 0,
      isAvailable: true,
    });
    return true;
  }

  private getTotalOrderValue(orderItems: OrderItem[]): number {
    return orderItems.reduce((acc: number, x: OrderItem) => acc + x.value, 0);
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
