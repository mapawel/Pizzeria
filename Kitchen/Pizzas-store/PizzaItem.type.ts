import { Pizza } from './Pizza/Pizza.class';
import { IngredientItem } from '../Ingredients-store/Ingredient-item.type';
export type PizzaItem = {
  pizza: Pizza;
  recipe: Map<string, IngredientItem>;
  time: number;
};
