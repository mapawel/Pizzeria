import { Ingredient } from 'Kitchen-service/Ingredients/Ingredient/Ingredient.class';
import { Pizza } from './Pizza/Pizza.class';
export type PizzaItem = {
  pizza: Pizza;
  recipe: Map<string, Ingredient>;
  time: number;
};
