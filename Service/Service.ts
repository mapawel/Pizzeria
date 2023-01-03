import { WorkerItem } from '../Workers/WorkerItem.type';
import { KitchenService } from '../Kitchen/Kitchen-service';
import { TablesStore } from '../Tables/Tables-store.class';
import { WorkersStore } from '../Workers/Workers-store.class';
import { Order } from './Order/Order.class';
import { TableItem } from 'Tables/TableItem.type';

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

  public prepareToOrder()

  public orderToGo() {}

  public orderWhReservation() {}
}
