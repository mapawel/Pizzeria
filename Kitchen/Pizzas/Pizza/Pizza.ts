import { PizzaIngredient } from '../Pizza-ingredient/PizzaIngredient';

export class Pizza {
  readonly nameId: string;
  readonly name: string;
  readonly recipe: Map<string, PizzaIngredient>;
  public constructor(name: string, recipe: Map<string, PizzaIngredient>) {
    this.nameId = name.replace(/\s/g, '').toUpperCase();
    this.name = name.trim();
    this.recipe = recipe;
  }
}
