import { Ingredient } from './Ingredient/Ingredient.class';

export class IngretientStoreError extends Error {
  constructor(
    readonly message: string,
    readonly payload?: { ingredient?: Ingredient; qty?: number; nameId?: string }
  ) {
    super(message);
  }
}
