import { ProductItem } from "../../Products/Product-item.type";

export type OrderItem = {
  readonly product: ProductItem;
  readonly qty: number;
  readonly unitPrice: number;
  readonly value: number;
};
