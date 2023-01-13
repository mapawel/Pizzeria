import { Pizza } from './Kitchen/Pizzas/Pizza/Pizza.class';
import { PizzaStore } from './Kitchen/Pizzas/Pizza-store.class';
import { Ingredient } from './Kitchen/Ingredients/Ingredient/Ingredient.class';
import { KitchenService } from './Kitchen/Kitchen-service';
import { IngredientsStore } from './Kitchen/Ingredients/Ingredients-store.class';
import { Worker } from './Workers/Worker/Worker.class';
import { Role } from './Workers/Worker/Roles.enum';
import { WorkersStore } from './Workers/Workers-store.class';
import { TablesStore } from './Tables/Tables-store.class';
import { Table } from './Tables/Table/Table.class';
import { ProductsStore } from './Products/Products-store';
import { Service } from './Service/Service';
import { WorkerItem } from './Workers/WorkerItem.type';
import { DiscountStore } from './Discounts/Discount-store.class';
import { Discount } from './Discounts/Discount/Discount.class';
import { DiscountType } from './Discounts/Discount/Discount-type.enum';
import { OrdersService } from './Orders/Orders-service.class';
import { OrdersServiceCollections } from './Orders/Order/Orders-service.collections.enum';

const i1 = new Ingredient('serek');
const i2 = new Ingredient('sosik');
const i3 = new Ingredient('papryczki');
const pstore = PizzaStore.getInstance();
const kitchen = KitchenService.getInstance();
const ingredients = IngredientsStore.getInstance();
const cook1 = new Worker('kucharz1', Role.cook);
const cook2 = new Worker('kucharz2', Role.cook);
const cook3 = new Worker('kucharz3', Role.cook);
const table1 = new Table('1', 4);
const table2 = new Table('2', 4);
const table3 = new Table('3', 4);
const discount1 = new Discount('student', DiscountType.unlimited, 0);
const discount2 = new Discount('qwe', DiscountType.limited, 0.1, 10);
const workers = WorkersStore.getInstance();
const tables = TablesStore.getInstance();
const products = ProductsStore.getInstance();
const mainService = Service.getInstance();
const discounts = DiscountStore.getInstance();
const orders = OrdersService.getInstance();

discounts.addOrUpdateItem(discount1);
discounts.addOrUpdateItem(discount2);

workers.addOrUpdateItem(cook1, false);
workers.addOrUpdateItem(cook2, false);
workers.addOrUpdateItem(cook3, false);

tables.addOrUpdateItem(table1, 0, true);
tables.addOrUpdateItem(table2, 0, true);
tables.addOrUpdateItem(table3, 0, true);

ingredients.addOrUpdateItem(i1, 1000);
ingredients.addOrUpdateItem(i2, 1000);
ingredients.addOrUpdateItem(i3, 1000);

const pizzaMarg = pstore.createAndAddNewPizza(
  'margerita',
  [
    {
      ingredient: i1,
      qty: 10,
    },
    {
      ingredient: i2,
      qty: 20,
    },
  ],
  12
);

const pizzaCapri = pstore.createAndAddNewPizza(
  'capri',
  [
    {
      ingredient: i2,
      qty: 44,
    },
    {
      ingredient: i3,
      qty: 44,
    },
  ],
  15
);

const prodMarg = products.addOrUpdateItem(pizzaMarg, 84);
const prodCapri = products.addOrUpdateItem(pizzaCapri, 66);

const order = mainService.orderWhReservation(
  [
    { product: prodMarg, qty: 1 },
    { product: prodCapri, qty: 2 },
  ],
  4,
  'qwe'
);

// console.log('workers ----> ', workers.test());
// console.log('tables ----> ', tables.test());
console.log(
  'orders to prepare----> ',
  mainService.listOrders(OrdersServiceCollections.ordersPending)
);
console.log(
  'orders in progress ----> ',
  mainService.listOrders(OrdersServiceCollections.ordersInProgress)
);

workers.addOrUpdateItem(cook2, true);
const freeCook: WorkerItem = workers.findItemById('kucharz2');
workers.addOrUpdateItem(cook3, true);

const executingOrder = mainService.executePendingOrder(order, freeCook);

console.log(
  'EXECUTED orders to prepare----> ',
  mainService.listOrders(OrdersServiceCollections.ordersPending)
);
console.log(
  'EXECUTED orders in progress ----> ',
  mainService.listOrders(OrdersServiceCollections.ordersInProgress)
);
mainService.makeTableFree(executingOrder);
mainService.finishOrderByCook(executingOrder);
