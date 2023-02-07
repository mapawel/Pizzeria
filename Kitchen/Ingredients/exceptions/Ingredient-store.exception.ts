import { StockIngredient } from '../Stock-ingredient/Stock-ingredient';

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
