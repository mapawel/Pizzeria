import { Ingredient } from 'Kitchen-service/Ingredients/Ingredient/Ingredient.class';

export class Pizza {
  readonly nameId: string;
  readonly name: string;
  readonly recipe: Map<string, Ingredient>;
  public constructor(name: string, recipe: Map<string, Ingredient>) {
    this.nameId = name.replace(/\s/g, '').toUpperCase();
    this.name = name.trim();
    this.recipe = recipe;
  }
}
