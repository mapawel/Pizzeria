export interface OrderResDTO {
  orderItems: {
    pizzaNameId: string;
    qty: number;
  }[];
  totalValue: number;
  cookId: string | null;
  tableNameId: string | (() => string) | null;
}
