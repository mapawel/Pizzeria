import { StockIngredient } from './Stock-ingredient/Stock-ingredient.class';

export class IngretientStoreError extends Error {
  constructor(
    readonly message: string,
    readonly payload?: {
      ingredient?: StockIngredient;
      qty?: number;
      nameId?: string;
    }
  ) {
    super(message);
  }
}
