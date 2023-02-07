import { PizzaIngredient } from '../Pizza-ingredient/Pizza-ingredient';

export type PizzaResDTO = {
  readonly nameId: string;
  readonly name: string;
  readonly recipe: Map<string, PizzaIngredient>;
  readonly price: number;
};
