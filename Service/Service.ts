import { WorkerItem } from '../Workers/WorkerItem.type';
import { KitchenService } from '../Kitchen/Kitchen-service';
import { TablesStore } from '../Tables/Tables-store.class';
import { WorkersStore } from '../Workers/Workers-store.class';
import { Order } from './Order/Order.class';
import { TableItem } from '../Tables/TableItem.type';
import { Role } from '../Workers/Worker/Roles.enum';
import { ProductItem } from '../Products-service/ProductItem.type';
import { OrderItem } from './Order/OrderItem.type';
import { table } from 'console';
import { IngredientItem } from 'Kitchen/Ingredients-store/Ingredient-item.type';
import { ServiceError } from './Order/Service.exception';

export class Service {
  static instance: Service | null;
  private readonly kitchen: KitchenService;
  private readonly tables: TablesStore;
  private readonly workers: WorkersStore;
  private readonly ordersToPrepare: Map<
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

  private constructor() {
    this.kitchen = KitchenService.getInstance();
    this.tables = TablesStore.getInstance();
    this.workers = WorkersStore.getInstance();
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
  //------

  public orderToGo(
    preOrdersArr: {
      product: ProductItem;
      qty: number;
    }[],
    discount: number
  ): Order<null, WorkerItem, null> {
    const cook: WorkerItem | false = this.workers.findAvailableWorker(
      Role.cook
    );
    if (!cook)
      throw new ServiceError(
        'This order cannot be delivered - no cook available.',
        { preOrdersArr, discount }
      );
    const orderItems: OrderItem[] = this.createOrderItems(
      preOrdersArr,
      discount
    );
    const ingredients: IngredientItem[] =
      this.kitchen.takeIngredientsForOrder(orderItems);
    const totalValue: number = orderItems.reduce(
      (acc: number, x: OrderItem) => acc + x.value,
      0
    );
    const newOrder = new Order(orderItems, totalValue, cook, null);
    cook.isAvailable = false;
    this.kitchen.cookPizzas(ingredients);
    this.ordersInProgress.set(newOrder.id, newOrder);
    return newOrder;
  }

  // public orderWhReservation(
  //   preOrdersArr: {
  //     product: ProductItem;
  //     qty: number;
  //   }[],
  //   discount: number
  // ): Order<null, WorkerItem, TableItem> {
  //   const cook: WorkerItem = this.workers.findAvailableWorker(Role.cook); // it will work without a cook
  //   // table validator
  //   const orderItems: OrderItem[] = this.createOrderItems(
  //     preOrdersArr,
  //     discount
  //   );
  //   const ingredients: IngredientItem[] =
  //     this.kitchen.takeIngredientsForOrder(orderItems);
  //   const totalValue: number = orderItems.reduce(
  //     (acc: number, x: OrderItem) => acc + x.value,
  //     0
  //   );
  //   const newOrder = new Order(orderItems, totalValue, cook, null);
  //   cook.isAvailable = false;
  //   this.kitchen.cookPizzas(ingredients);
  //   this.ordersInProgress.set(newOrder.id, newOrder);
  //   return newOrder;
  // }

  public finishOrder(
    order: Order<WorkerItem, WorkerItem, TableItem | null>
  ): boolean {
    this.workers.addOrUpdateItem(order.cook.worker, true);
    this.ordersInProgress.delete(order.id);
    this.ordersFinished.set(order.id, order);
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
        unitPrice: product.price * discount,
        value: product.price * qty * discount,
      })
    );
  }
}
