import { PizzaIngredient } from '../Pizza-ingredient/Pizza-ingredient.class';

export type PizzaResDTO = {
  readonly nameId: string;
  readonly name: string;
  readonly recipe: Map<string, PizzaIngredient>;
};
