import { OrdersStore } from './Orders-store/Orders.store';
import { OrderIn } from './Order/OrderIn';
import { OrderToGo } from './Order/OrderToGo';
import { KitchenService } from '../Kitchen/Kitchen.service';
import { TablesStore } from '../Tables/Tables.store';
import { WorkersStore } from '../Workers/Workers.store';
import { DiscountStore } from '../Discounts/Discount-store/Discount.store';
import { OrdersServiceCollections } from './Order/Orders-service.collections.enum';
import { Discount } from '../Discounts/Discount/Discount';
import { OrdersServiceError } from './exceptions/Orders.service.exception';
import { OrderItem } from './Order/OrderItem.type';
import { Role } from '../Workers/Worker/Roles.enum';
import { DiscountService } from '../Discounts/Discount.service';
import { PizzaIngredient } from 'Kitchen/Pizzas/Pizza-ingredient/PizzaIngredient';
import { OrderResDTO } from './DTO/OrderRes.dto';
import { Worker } from 'Workers/Worker/Worker';
import { WorkerDTO } from 'Workers/DTO/WorkerDTO';
import { PizzaResDTO } from 'Kitchen/Pizzas/DTO/PizzaRes.dto';
import { PizzaIngredientDTO } from 'Kitchen/Pizzas/DTO/PizzaIngredient.dto';

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

  public orderToGo(
    preOrdersArr: {
      productNameId: string;
      qty: number;
    }[],
    discount?: string
  ): OrderResDTO {
    const cook: WorkerDTO | null = this.workers.findAvailableWorker(Role.COOK);
    if (!cook?.id)
      throw new OrdersServiceError(
        'This order cannot be delivered - no cook available.',
        { preOrdersArr, discount }
      );

    const orderItems: OrderItem[] = this.createOrderItems(preOrdersArr);
    // TODO zostawiam ale sprawdzić czy można tu potem usunąć dodawanie ceny

    const ingredients: PizzaIngredientDTO[] =
      this.kitchen.takeIngredientsForOrder(orderItems);

    const totalValue: number = this.getTotalOrderValue(orderItems, discount);

    this.workers.updateWorker({
      ...cook,
      isAvailable: false,
    });

    const newOrder = new OrderToGo(orderItems, totalValue, cook.id);

    this.kitchen.cookPizzas(ingredients);
    if (discount)
      this.discounts.useLimitedDiscount(
        discount,
        this.getTotalPizzasQty(orderItems)
      );
    this.orders.addOrUpdateOrder(
      newOrder,
      OrdersServiceCollections.ORDERS_IN_PROGRESS
    );

    return {
      orderItems: newOrder.orderItems.map((order: OrderItem) => ({
        pizzaNameId: order.pizzaNameId,
        qty: order.qty,
        unitPrice: order.unitPrice,
      })),
      totalValue: newOrder.totalValue,
      cookId: newOrder.cookId,
      tableId: null,
    };
  }

  // public orderWhReservation(
  //   preOrdersArr: {
  //     productNameId: string;
  //     qty: number;
  //   }[],
  //   tablePerson: number,
  //   discount?: string
  // ): Order<WorkerItem | null, TableItem> {
  //   const table: TableItem | null = this.tables.findFreeTable(tablePerson);
  //   if (!table)
  //     throw new OrdersServiceError(
  //       'This order cannot be prepared - no a free table available. Check if the customer wants to order to go out.',
  //       { preOrdersArr, discount, tablePerson }
  //     );

  //   const updatedTable: TableItem = this.tables.addOrUpdateItem(table.table, {
  //     sitsToReserve: tablePerson,
  //     isAvailable: false,
  //   });

  //   const orderItems: OrderItem[] = this.createOrderItems(preOrdersArr);

  //   const ingredients: PizzaIngredient[] =
  //     this.kitchen.takeIngredientsForOrder(orderItems);
  //   const totalValue: number = this.getTotalOrderValue(orderItems, discount);

  //   const cook: WorkerItem | null = this.workers.findAvailableWorker(Role.COOK);
  //   let newOrder;

  //   if (cook) {
  //     const updatedCook: WorkerItem = this.workers.addOrUpdateItem(
  //       cook.worker,
  //       { isAvailable: false }
  //     );
  //     newOrder = new Order(orderItems, totalValue, updatedCook, updatedTable);
  //     this.kitchen.cookPizzas(ingredients);
  //     this.orders.addOrUpdateOrder(
  //       newOrder,
  //       OrdersServiceCollections.ORDERS_IN_PROGRESS
  //     );
  //   } else {
  //     newOrder = new Order(orderItems, totalValue, null, updatedTable);
  //     this.orders.addOrUpdateOrder(
  //       newOrder,
  //       OrdersServiceCollections.ORDERS_PENDING
  //     );
  //   }
  //   if (discount)
  //     this.discounts.useLimitedDiscount(
  //       discount,
  //       this.getTotalPizzasQty(orderItems)
  //     );
  //   return newOrder;
  // }

  private createOrderItems(
    preOrdersArr: {
      productNameId: string;
      qty: number;
    }[]
  ): OrderItem[] {
    return preOrdersArr.map(
      ({ productNameId, qty }: { productNameId: string; qty: number }) => {
        const product: PizzaResDTO = this.kitchen.findPizzaById(productNameId);
        return {
          pizzaNameId: product.nameId,
          qty,
          unitPrice: product.price,
        };
      }
    );
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

    return orderItems.reduce(
      (acc: number, x: OrderItem) =>
        acc + x.unitPrice * x.qty * (1 - discountPercent),
      0
    );
  }

  private getTotalPizzasQty(orderItems: OrderItem[]): number {
    return orderItems.reduce((acc: number, x: OrderItem) => acc + x.qty, 0);
  }
}
