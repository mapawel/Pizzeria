import { Pizza } from './Kitchen/Pizzas-store/Pizza/Pizza.class';
import { PizzaStore } from './Kitchen/Pizzas-store/Pizza-store.class';
import { Ingredient } from './Kitchen/Ingredients-store/Ingredient/Ingredient.class';
import { KitchenService } from './Kitchen/Kitchen-service.class';
import { IngredientsStore } from './Kitchen/Ingredients-store/Ingredients-store.class';

const i1 = new Ingredient('serek');
const i2 = new Ingredient('sosik');
const pstore = PizzaStore.getInstance();
const kitchen = KitchenService.getInstance();
const ingredients = IngredientsStore.getInstance();

ingredients.addOrUpdateItem(i1, 1000);
ingredients.addOrUpdateItem(i2, 2000);

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

console.log('i1 ----> ', ingredients.findItem('SEREK'));
console.log('i2 ----> ', ingredients.findItem('SOSIK'));

kitchen.cookPizzas('MARGERITA', 2);

console.log('i1 ----> ', ingredients.findItem('SEREK'));
console.log('i2 ----> ', ingredients.findItem('SOSIK'));
