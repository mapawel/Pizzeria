import { v4 as uuidv4 } from 'uuid';
import { PizzaIngredient } from '../Pizza-ingredient/Pizza-ingredient';

export class Pizza {
  readonly id: string;
  readonly nameId: string;
  readonly name: string;
  readonly recipe: Map<string, PizzaIngredient>;
  readonly price: number;
  public constructor(
    name: string,
    recipe: Map<string, PizzaIngredient>,
    price: number
  ) {
    this.id = uuidv4();
    this.nameId = name.replace(/\s/g, '').toUpperCase();
    this.name = name.trim();
    this.recipe = recipe;
    this.price = price;
  }
}
