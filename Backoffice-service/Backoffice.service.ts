import { WorkersStore } from '../Workers/Workers.store';
import { TablesStore } from '../Tables/Tables.store';
import { Worker } from '../Workers/Worker/Worker.class';
import { WorkerItem } from '../Workers/Worker-item.type';
import { TableItem } from '../Tables/Table-item.type';
import { Table } from '../Tables/Table/Table.class';
import { Order } from '../Orders/Order/Order.class';
import { IngredientItem } from '../Kitchen-service/Ingredients/Ingredient-item.type';
import { OrdersServiceCollections } from '../Orders/Order/Orders-service.collections.enum';
import { KitchenService } from '../Kitchen-service/Kitchen.service';
import { OrdersStore } from '../Orders/Orders-store/Orders.store';
import { OrderItem } from 'Orders/Order/Order-item.type';

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
        OrdersServiceCollections.ordersPending
      );
    const { id, orderItems }: { id: string; orderItems: OrderItem[] } =
      foundOrder;

    const ingredients: IngredientItem[] =
      this.kitchen.takeIngredientsForOrder(orderItems);

    const workerItem: WorkerItem = this.workers.findAvailableCookById(cookId);

    const updatedWorkerItem = this.workers.addOrUpdateItem(workerItem.worker, {
      isAvailable: false,
    });

    this.kitchen.cookPizzas(ingredients);

    const updatedOrder: Order<WorkerItem | null, TableItem | null> =
      this.orders.addOrUpdateOrder(
        { ...foundOrder, cook: updatedWorkerItem },
        OrdersServiceCollections.ordersPending
      );
    this.orders.addOrUpdateOrder(
      updatedOrder,
      OrdersServiceCollections.ordersInProgress
    );
    this.orders.deleteOrder(id, OrdersServiceCollections.ordersPending);

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
        OrdersServiceCollections.ordersInProgress
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
        OrdersServiceCollections.ordersInProgress
      );
    this.orders.addOrUpdateOrder(
      updatedOrder,
      OrdersServiceCollections.ordersFinished
    );
    this.orders.deleteOrder(
      updatedOrder.id,
      OrdersServiceCollections.ordersInProgress
    );
    return updatedOrder as Order<WorkerItem, TableItem | null>;
  }

  public makeTableFree(orderId: string): boolean {
    const foundOrder: Order<WorkerItem | null, TableItem | null> =
      this.orders.findOrderById(
        orderId,
        OrdersServiceCollections.ordersFinished
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

  public getTableById(id: string): TableItem {
    return this.tables.findItemById(id);
  }

  public addTable(
    table: Table,
    {
      sitsToReserve,
      isAvailable,
    }: { sitsToReserve: number; isAvailable: boolean }
  ): boolean {
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
