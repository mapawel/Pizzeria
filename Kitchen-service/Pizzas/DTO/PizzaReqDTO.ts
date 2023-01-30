import { Ingredient } from 'Kitchen-service/Ingredients/Ingredient/Ingredient.class';

export type PizzaReqDTO = {
  name: string;
  ingredients: Ingredient[];
};
