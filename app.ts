// just an example code here - more detailed information about the app working can be read in tests

import { Role } from './Workers/Worker/Roles.enum';
import { OrderResDTO } from './Orders/DTO/Order-res.dto';
import { OrderState } from './Orders/Order/orders-state.enum';
import { WorkerDTO } from './Workers/DTO/Worker.dto';
import { BackofficeService } from './Backoffice-service/Backoffice.service';
import { CustomerService } from './Customer-service/Customer.service';
import { TableDTO } from './Tables/DTO/Table.dto';

const backoffice: BackofficeService = BackofficeService.getInstance();
const service: CustomerService = CustomerService.getInstance();

backoffice.addDiscount('qwe', 0.1, 3);
backoffice.addDiscount('asd', 0.5);

backoffice.addIngredient('cake', 1000);
backoffice.addIngredient('sose', 1000);
backoffice.addIngredient('cheese', 1000);
backoffice.addIngredient('salami', 1000);

const margeritta = backoffice.addPizza(
  'margeritta',
  [
    { stockIngredientNameId: 'CAKE', qtyNeeded: 100 },
    { stockIngredientNameId: 'CHEESE', qtyNeeded: 100 },
    { stockIngredientNameId: 'SOSE', qtyNeeded: 50 },
  ],
  100
);

const salame = backoffice.addPizza(
  'salame',
  [
    { stockIngredientNameId: 'CAKE', qtyNeeded: 100 },
    { stockIngredientNameId: 'CHEESE', qtyNeeded: 200 },
    { stockIngredientNameId: 'SOSE', qtyNeeded: 50 },
    { stockIngredientNameId: 'SALAMI', qtyNeeded: 75 },
  ],
  200
);

backoffice.addWorker({
  name: 'andrzej',
  role: Role.COOK,
  isAvailable: false,
});

const exampleTable: TableDTO = backoffice.addTable({
  name: '    PIerwszY ',
  sits: 4,
  sitsAvailable: 4,
  isAvailable: true,
});

const order: OrderResDTO = service.orderIn(
  [
    {
      pizzaNameId: margeritta.nameId,
      qty: 2,
    },
    {
      pizzaNameId: salame.nameId,
      qty: 1,
    },
  ],
  3,
  'QWE'
);

console.log(
  'pending orders ----> ',
  service.listOrders(OrderState.ORDERS_PENDING)
);
console.log(
  'in progress orders ----> ',
  service.listOrders(OrderState.ORDERS_IN_PROGRESS)
);
console.log(
  'finished orders ----> ',
  service.listOrders(OrderState.ORDERS_FINISHED)
);

const cook: WorkerDTO = backoffice.addWorker({
  name: 'janusz',
  role: Role.COOK,
  isAvailable: true,
});

console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>EXECUTING ----> ');
service.executePendingOrder(order.id, cook.id as string);

console.log(
  'pending orders ----> ',
  service.listOrders(OrderState.ORDERS_PENDING)
);
console.log(
  'in progress orders ----> ',
  service.listOrders(OrderState.ORDERS_IN_PROGRESS)
);
console.log(
  'finished orders ----> ',
  service.listOrders(OrderState.ORDERS_FINISHED)
);

console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>FINISHING ----> ');
service.finishOrder(order.id);

console.log(
  'pending orders ----> ',
  service.listOrders(OrderState.ORDERS_PENDING)
);
console.log(
  'in progress orders ----> ',
  service.listOrders(OrderState.ORDERS_IN_PROGRESS)
);
console.log(
  'finished orders ----> ',
  service.listOrders(OrderState.ORDERS_FINISHED)
);

service.makeOrderTableFree(order.id);

if (exampleTable.id)
  console.log('table ----> ', backoffice.findTableById(exampleTable.id));
