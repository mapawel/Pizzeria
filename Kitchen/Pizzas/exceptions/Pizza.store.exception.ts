import { Pizza } from '../Pizza/Pizza';

export class PizzaStoreError extends Error {
  constructor(
    readonly message: string,
    readonly payload?: { pizza?: Pizza; qty?: number; nameId?: string }
  ) {
    super(message);
  }
}
