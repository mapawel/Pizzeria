import { Ingredient } from 'Kitchen-service/Ingredients/Ingredient/Ingredient.class';

export type PizzaResDTO = {
  readonly nameId: string;
  readonly name: string;
  readonly recipe: Map<string, Ingredient>;
};
