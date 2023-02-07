import { v4 as uuidv4 } from 'uuid';
import { Ingredient } from 'Kitchen/interfaces/Ingredient.interface';

export class PizzaIngredient implements Ingredient {
  readonly id: string;
  readonly nameId: string;
  readonly qty: number;
  public constructor(nameId: string, qty: number) {
    this.id = uuidv4();
    this.nameId = nameId;
    this.qty = qty;
  }
}
