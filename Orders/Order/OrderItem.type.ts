import { ProductItem } from 'Products/ProductItem.type';

export type OrderItem = {
  product: ProductItem;
  qty: number;
  unitPrice: number;
  value: number;
};
