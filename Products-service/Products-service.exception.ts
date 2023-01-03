import { ProductItem } from './ProductItem.type';

export class ProductsServiceError extends Error {
  constructor(
    readonly message: string,
    readonly payload?: { id?: string; productItem?: ProductItem }
  ) {
    super(message);
  }
}
