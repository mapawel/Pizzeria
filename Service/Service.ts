import { WorkerItem } from '../Workers/WorkerItem.type';
import { KitchenService } from '../Kitchen/Kitchen-service';
import { TablesStore } from '../Tables/Tables-store.class';
import { WorkersStore } from '../Workers/Workers-store.class';
import { Order } from './Order/Order.class';
import { TableItem } from '../Tables/TableItem.type';
import { Role } from '../Workers/Worker/Roles.enum';
import { ProductItem } from '../Products-service/ProductItem.type';
import { ServiceError } from './Order/Service.exception';
import { OrderItem } from './Order/OrderItem.type';
import { table } from 'console';
import { IngredientItem } from 'Kitchen/Ingredients-store/Ingredient-item.type';

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

  public orderToGo(
    preOrdersArr: {
      product: ProductItem;
      qty: number;
    }[],
    discount: number
  ): Order<null, WorkerItem, null> {
    const cook = this.workers.findAvailableWorker(Role.cook);
    const orderItems: OrderItem[] = this.createOrderItems(
      preOrdersArr,
      discount
    );
    // dodać walidację czy są składniki!
    const totalValue = orderItems.reduce(
      (acc: number, x: OrderItem) => acc + x.value,
      0
    );
    this.kitchen.takeIngredientsForOrder(orderItems)
    // orderItems.forEach((orderItem: OrderItem) =>
    //   this.kitchen.takeOnePizzaTypeIngredients(
    //     orderItem.product.pizzaItem.pizza.nameId,
    //     orderItem.qty
    //   )
    // );

    // zmiana statusu kucharza na isAvailable: false
    const newOrder = new Order(orderItems, totalValue, cook, null);
    return newOrder;
  }

  public orderWhReservation() {}

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
