import { ProductItem } from 'Products-service/ProductItem.type';

export type OrderItem = {
  product: ProductItem;
  qty: number;
  unitPrice: number;
  value: number;
};
