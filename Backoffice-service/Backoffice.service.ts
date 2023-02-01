import { WorkersStore } from '../Workers/Workers.store';
import { TablesStore } from '../Tables/Tables.store';
import { Worker } from '../Workers/Worker/Worker';
import { WorkerItem } from '../Workers/Worker-item.type';
import { TableItem } from '../Tables/Table-item.type';
import { Table } from '../Tables/Table/Table';
import { Order } from '../Orders/Order/Order.class';
import { OrdersServiceCollections } from '../Orders/Order/Orders-service.collections.enum';
import { KitchenService } from '../Kitchen/Kitchen.service';
import { OrdersStore } from '../Orders/Orders-store/Orders.store';
import { OrderItem } from 'Orders/Order/Order-item.type';
import { PizzaIngredient } from 'Kitchen/Pizzas/Pizza-ingredient/PizzaIngredient';

export class BackofficeService {
  private static instance: BackofficeService | null;
  private readonly workers: WorkersStore;
  private readonly tables: TablesStore;
  private readonly kitchen: KitchenService;
  private readonly orders: OrdersStore;

  private constructor() {
    this.workers = WorkersStore.getInstance();
    this.tables = TablesStore.getInstance();
    this.kitchen = KitchenService.getInstance();
    this.orders = OrdersStore.getInstance();
  }

  public static getInstance() {
    if (BackofficeService.instance) return BackofficeService.instance;
    return (BackofficeService.instance = new BackofficeService());
  }

  public static resetInstance() {
    BackofficeService.instance = null;
  }

  public executePendingOrder(
    orderId: string,
    cookId: string
  ): Order<WorkerItem, TableItem> {
    const foundOrder: Order<WorkerItem | null, TableItem | null> =
      this.orders.findOrderById(
        orderId,
        OrdersServiceCollections.ORDERS_PENDING
      );
    const { id, orderItems }: { id: string; orderItems: OrderItem[] } =
      foundOrder;

    const ingredients: PizzaIngredient[] =
      this.kitchen.takeIngredientsForOrder(orderItems);

    const workerItem: WorkerItem = this.workers.findAvailableCookById(cookId);

    const updatedWorkerItem = this.workers.addOrUpdateItem(workerItem.worker, {
      isAvailable: false,
    });

    this.kitchen.cookPizzas(ingredients);

    const updatedOrder: Order<WorkerItem | null, TableItem | null> =
      this.orders.addOrUpdateOrder(
        { ...foundOrder, cook: updatedWorkerItem },
        OrdersServiceCollections.ORDERS_PENDING
      );
    this.orders.addOrUpdateOrder(
      updatedOrder,
      OrdersServiceCollections.ORDERS_IN_PROGRESS
    );
    this.orders.deleteOrder(id, OrdersServiceCollections.ORDERS_PENDING);

    return updatedOrder as Order<WorkerItem, TableItem>;
  }

  public finishOrderByCook(
    orderId: string,
    cookId: string
  ): Order<WorkerItem, TableItem | null> {
    const foundWorkerItem: WorkerItem = this.findWorkerById(cookId);
    const foundOrder: Order<WorkerItem | null, TableItem | null> =
      this.orders.findOrderById(
        orderId,
        OrdersServiceCollections.ORDERS_IN_PROGRESS
      );
    const updatedWorkerItem: WorkerItem = this.updateWorker(
      foundWorkerItem.worker.id,
      {
        isAvailable: true,
      }
    );
    const updatedOrder: Order<WorkerItem | null, TableItem | null> =
      this.orders.addOrUpdateOrder(
        { ...foundOrder, cook: updatedWorkerItem },
        OrdersServiceCollections.ORDERS_IN_PROGRESS
      );
    this.orders.addOrUpdateOrder(
      updatedOrder,
      OrdersServiceCollections.ORDERS_FINISHED
    );
    this.orders.deleteOrder(
      updatedOrder.id,
      OrdersServiceCollections.ORDERS_IN_PROGRESS
    );
    return updatedOrder as Order<WorkerItem, TableItem | null>;
  }

  public makeTableFree(orderId: string): boolean {
    const foundOrder: Order<WorkerItem | null, TableItem | null> =
      this.orders.findOrderById(
        orderId,
        OrdersServiceCollections.ORDERS_FINISHED
      );
    if (foundOrder.table?.table) {
      this.tables.addOrUpdateItem(foundOrder.table.table, {
        sitsToReserve: 0,
        isAvailable: true,
      });
      return true;
    }
    return false;
  }

  public findWorkerById(workerId: string): WorkerItem {
    return this.workers.findItemById(workerId);
  }

  public addWorker(
    worker: Worker,
    { isAvailable }: { isAvailable: boolean }
  ): WorkerItem {
    return this.workers.addOrUpdateItem(worker, { isAvailable });
  }

  public removeWorker(workerId: string): boolean {
    return this.workers.removeExistingItem(workerId);
  }

  public updateWorker(
    workerId: string,
    { isAvailable }: { isAvailable: boolean }
  ): WorkerItem {
    return this.workers.updateExistingItemParam(workerId, { isAvailable });
  }

  public findTableById(id: string): TableItem {
    return this.tables.findItemById(id);
  }

  public addTable(
    table: Table,
    {
      sitsToReserve,
      isAvailable,
    }: { sitsToReserve: number; isAvailable: boolean }
  ): TableItem {
    return this.tables.addOrUpdateItem(table, { sitsToReserve, isAvailable });
  }

  public removeTable(tableId: string): boolean {
    return this.tables.removeExistingItem(tableId);
  }

  public updateTable(
    tableId: string,
    {
      sitsToReserve,
      isAvailable,
    }: { sitsToReserve: number; isAvailable: boolean }
  ): TableItem {
    return this.tables.updateExistingItemParam(tableId, {
      sitsToReserve,
      isAvailable,
    });
  }
}
