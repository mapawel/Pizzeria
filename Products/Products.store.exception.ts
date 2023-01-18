import { ProductItem } from './Product-item.type';

export class ProductsStoreError extends Error {
  constructor(
    readonly message: string,
    readonly payload?: { id?: string; productItem?: ProductItem }
  ) {
    super(message);
  }
}
