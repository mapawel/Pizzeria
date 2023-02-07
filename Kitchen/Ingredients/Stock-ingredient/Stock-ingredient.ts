import { v4 as uuidv4 } from 'uuid';
import { Ingredient } from 'Kitchen/interfaces/Ingredient.interface';

export class StockIngredient implements Ingredient {
  readonly id: string;
  readonly nameId: string;
  readonly name: string;
  readonly qty: number;
  public constructor(name: string, qty: number) {
    this.id = uuidv4();
    this.nameId = name.replace(/\s/g, '').toUpperCase();
    this.name = name.trim().toLowerCase();
    this.qty = qty;
  }
}
