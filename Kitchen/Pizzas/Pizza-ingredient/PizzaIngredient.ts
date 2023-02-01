import { Ingredient } from 'Kitchen/interfaces/Ingredient.interface';

export class PizzaIngredient implements Ingredient {
  readonly nameId: string;
  readonly qty: number;
  public constructor(nameId: string, qty: number) {
    this.nameId = nameId;
    this.qty = qty;
  }
}
