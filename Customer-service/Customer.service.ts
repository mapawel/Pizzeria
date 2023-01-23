import { WorkerItem } from '../Workers/Worker-item.type';
import { TablesStore } from '../Tables/Tables.store';
import { Order } from '../Orders/Order/Order.class';
import { TableItem } from '../Tables/Table-item.type';
import { ProductItem } from '../Products/Product-item.type';
import { OrdersServiceCollections } from '../Orders/Order/Orders-service.collections.enum';
import { ProductsStore } from '../Products/Products.store';
import { OrdersService } from '../Orders/Orders-service/Orders.service';
import { BackofficeService } from '../Backoffice-service/Backoffice.service';

export class CustomerService {
  private static instance: CustomerService | null;
  private readonly products: ProductsStore;
  private readonly orders: OrdersService;
  private readonly tables: TablesStore;
  private readonly backoffice: BackofficeService;

  private constructor() {
    this.products = ProductsStore.getInstance();
    this.orders = OrdersService.getInstance();
    this.tables = TablesStore.getInstance();
    this.backoffice = BackofficeService.getInstance();
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
    return this.orders.listOrders(ordersType);
  }

  public orderToGo(
    preOrdersArr: {
      productNameId: string;
      qty: number;
    }[],
    discount?: string
  ): Order<WorkerItem, null> {
    return this.orders.orderToGo(preOrdersArr, discount);
  }

  public orderWhReservation(
    preOrdersArr: {
      productNameId: string;
      qty: number;
    }[],
    tablePerson: number,
    discount?: string
  ): Order<WorkerItem | null, TableItem> {
    return this.orders.orderWhReservation(preOrdersArr, tablePerson, discount);
  }

  public executePendingOrder(
    orderId: string,
    cookId: string
  ): Order<WorkerItem, TableItem> {
    return this.backoffice.executePendingOrder(orderId, cookId);
  }

  public finishOrderByCook(orderId: string, cookId: string): boolean {
    return this.backoffice.finishOrderByCook(orderId, cookId);
  }

  public makeTableFree(order: Order<WorkerItem | null, TableItem>): boolean {
    this.tables.addOrUpdateItem(order.table.table, {
      sitsToReserve: 0,
      isAvailable: true,
    });
    return true;
  }
}
