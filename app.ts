import { Pizza } from './Kitchen/Pizzas-store/Pizza/Pizza.class';
import { PizzaStore } from './Kitchen/Pizzas-store/Pizza-store.class';
import { Ingredient } from './Kitchen/Ingredients-store/Ingredient/Ingredient.class';

const i1 = new Ingredient('serek');
const i2 = new Ingredient('sosik');
const pstore = PizzaStore.getInstance();

pstore.createAndAddNewPizza('margerita', [
  {
    ingredient: i1,
    qty: 10,
  },
  {
    ingredient: i2,
    qty: 20,
  },
], 12);

console.log(' ----> ', pstore.findItem('MARGERITA'));
