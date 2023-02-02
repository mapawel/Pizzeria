import { PizzaIngredient } from '../Pizza-ingredient/PizzaIngredient';

export type PizzaResDTO = {
  readonly nameId: string;
  readonly name: string;
  readonly recipe: Map<string, PizzaIngredient>;
  readonly price: number;
};
