import { Role } from './Workers/Worker/Roles.enum';
import { KitchenService } from './Kitchen/Kitchen.service';
import { OrdersService } from './Orders/Orders.service';
import { DiscountStore } from './Discounts/Discount-store/Discount.store';
import { WorkersStore } from './Workers/Workers.store';
import { TablesStore } from './Tables/Tables.store';
import { OrderResDTO } from './Orders/DTO/OrderRes.dto';
import { OrdersServiceCollections } from './Orders/Order/Orders-service.collections.enum';

const discounts = DiscountStore.getInstance();
const kitchen = KitchenService.getInstance();
const orders = OrdersService.getInstance();
const workers = WorkersStore.getInstance();
const tables = TablesStore.getInstance();

discounts.addDiscount('qwe', 0.1, 3);
discounts.addDiscount('asd', 0.5);

kitchen.addIngredient('cake', 1000);
kitchen.addIngredient('sose', 1000);
kitchen.addIngredient('cheese', 1000);
kitchen.addIngredient('salami', 1000);

const margeritta = kitchen.addPizza(
  'margeritta',
  [
    { stockIngredientNameId: 'CAKE', qtyNeeded: 100 },
    { stockIngredientNameId: 'CHEESE', qtyNeeded: 100 },
    { stockIngredientNameId: 'SOSE', qtyNeeded: 50 },
  ],
  100
);

const salame = kitchen.addPizza(
  'salame',
  [
    { stockIngredientNameId: 'CAKE', qtyNeeded: 100 },
    { stockIngredientNameId: 'CHEESE', qtyNeeded: 200 },
    { stockIngredientNameId: 'SOSE', qtyNeeded: 50 },
    { stockIngredientNameId: 'SALAMI', qtyNeeded: 75 },
  ],
  200
);

workers.addWorker({
  name: 'andrzej',
  role: Role.COOK,
  isAvailable: false,
});

workers.addWorker({
  name: 'janusz',
  role: Role.COOK,
  isAvailable: true,
});

tables.addTable({
  nameId: '1',
  sits: 4,
  sitsAvailable: 4,
  isAvailable: true,
});

const order: OrderResDTO = orders.orderToGo(
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
  'QWE'
);

console.log('order ----> ', order);
console.log(
  'pending orders ----> ',
  orders.listOrders(OrdersServiceCollections.ORDERS_PENDING)
);
console.log(
  'in progress orders ----> ',
  orders.listOrders(OrdersServiceCollections.ORDERS_IN_PROGRESS)
);
console.log(
  'finished orders ----> ',
  orders.listOrders(OrdersServiceCollections.ORDERS_FINISHED)
);
