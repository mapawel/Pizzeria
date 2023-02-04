// import { TablesStore } from '../Tables/Tables.store';
// import { OrderToGo } from '../Orders/Order/OrderToGo';
// import { OrdersServiceCollections } from '../Orders/Order/Orders-service.collections.enum';
// import { OrdersService } from '../Orders/Orders.service';
// import { BackofficeService } from '../Backoffice-service/Backoffice.service';

// export class CustomerService {
//   private static instance: CustomerService | null;
//   private readonly orders: OrdersService;
//   private readonly tables: TablesStore;
//   private readonly backoffice: BackofficeService;

//   private constructor() {
//     this.orders = OrdersService.getInstance();
//     this.tables = TablesStore.getInstance();
//     this.backoffice = BackofficeService.getInstance();
//   }

//   public static getInstance() {
//     if (CustomerService.instance) return CustomerService.instance;
//     return (CustomerService.instance = new CustomerService());
//   }

//   public static resetInstance() {
//     CustomerService.instance = null;
//   }

//   public listOrders(
//     ordersType: OrdersServiceCollections
//   ): Order<WorkerItem | null, TableItem | null>[] {
//     return this.orders.listOrders(ordersType);
//   }

//   public orderToGo(
//     preOrdersArr: {
//       productNameId: string;
//       qty: number;
//     }[],
//     discount?: string
//   ): Order<WorkerItem, null> {
//     return this.orders.orderToGo(preOrdersArr, discount);
//   }

//   public orderWhReservation(
//     preOrdersArr: {
//       productNameId: string;
//       qty: number;
//     }[],
//     tablePerson: number,
//     discount?: string
//   ): Order<WorkerItem | null, TableItem> {
//     return this.orders.orderWhReservation(preOrdersArr, tablePerson, discount);
//   }

//   public executePendingOrder(
//     orderId: string,
//     cookId: string
//   ): Order<WorkerItem, TableItem> {
//     return this.backoffice.executePendingOrder(orderId, cookId);
//   }

//   public finishOrderByCook(
//     orderId: string,
//     cookId: string
//   ): Order<WorkerItem, TableItem | null> {
//     return this.backoffice.finishOrderByCook(orderId, cookId);
//   }

//   public makeTableFree(orderId: string): boolean {
//     return this.backoffice.makeTableFree(orderId);
//   }
// }
