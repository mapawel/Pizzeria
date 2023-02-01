import { StockIngredient } from '../Stock-ingredient/StockIngredient';

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
