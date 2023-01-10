import { Pizza } from './Kitchen/Pizzas-store/Pizza/Pizza.class';
import { PizzaStore } from './Kitchen/Pizzas-store/Pizza-store.class';
import { Ingredient } from './Kitchen/Ingredients-store/Ingredient/Ingredient.class';
import { KitchenService } from './Kitchen/Kitchen-service';
import { IngredientsStore } from './Kitchen/Ingredients-store/Ingredients-store.class';
import { Worker } from './Workers/Worker/Worker.class';
import { Role } from './Workers/Worker/Roles.enum';
import { WorkersStore } from './Workers/Workers-store.class';
import { TablesStore } from './Tables/Tables-store.class';
import { Table } from './Tables/Table/Table.class';
import { ProductsService } from './Products-service/Products-service';
import { Service } from './Service/Service';

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
const workers = WorkersStore.getInstance();
const tables = TablesStore.getInstance();
const products = ProductsService.getInstance();
const mainService = Service.getInstance();

workers.addOrUpdateItem(cook1, true);
workers.addOrUpdateItem(cook2, true);
workers.addOrUpdateItem(cook3, true);

// tables.addOrUpdateItem(table1, 0, true);
// tables.addOrUpdateItem(table2, 0, true);
// tables.addOrUpdateItem(table3, 0, true);

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

const order = mainService.orderToGo(
  [
    { product: prodMarg, qty: 1 },
    { product: prodCapri, qty: 2 },
  ],
  0.5
);

console.log('infgredients ----> ', ingredients.test());
console.log('workers ----> ', workers.test());
console.log('manin service ----> ', mainService.testProgress());
console.log('manin service ----> ', mainService.testFinished());

mainService.finishOrder(order);
console.log('2workers ----> ', workers.test());
console.log('2manin service ----> ', mainService.testProgress());
console.log('2manin service ----> ', mainService.testFinished());
