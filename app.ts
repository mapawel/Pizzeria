import { Pizza } from './Kitchen/Pizzas-store/Pizza/Pizza.class';
import { PizzaStore } from './Kitchen/Pizzas-store/Pizza-store.class';
import { Ingredient } from './Kitchen/Ingredients-store/Ingredient/Ingredient.class';
import { KitchenService } from './Kitchen/Kitchen-service.class';
import { IngredientsStore } from './Kitchen/Ingredients-store/Ingredients-store.class';
import { Worker } from './Workers/Worker/Worker.class';
import { Role } from './Workers/Worker/Roles.enum';
import { WorkersStore } from './Workers/Workers-store.class';

const i1 = new Ingredient('serek');
const i2 = new Ingredient('sosik');
const pstore = PizzaStore.getInstance();
const kitchen = KitchenService.getInstance();
const ingredients = IngredientsStore.getInstance();
const cook1 = new Worker('kucharz1', Role.cook);
const cook2 = new Worker('kucharz2', Role.cook);
const cook3 = new Worker('kucharz3', Role.cook);
const workers = WorkersStore.getInstance();

workers.addOrUpdateItem(cook1);
workers.addOrUpdateItem(cook2);
workers.addOrUpdateItem(cook3);

console.log('workers ----> ', workers.test());

ingredients.addOrUpdateItem(i1, 1000);
ingredients.addOrUpdateItem(i2, 1000);

pstore.createAndAddNewPizza(
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

console.log('i1 ----> ', ingredients.findItemById('SEREK'));
console.log('i2 ----> ', ingredients.findItemById('SOSIK'));

const allIngredients = kitchen.prepareIngredients('MARGERITA', 2);
kitchen.cookPizzas(allIngredients);

console.log('i1 ----> ', ingredients.findItemById('SEREK'));
console.log('i2 ----> ', ingredients.findItemById('SOSIK'));
