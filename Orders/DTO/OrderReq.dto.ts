export interface OrderReqDTO {
  orderItems: {
    pizzaNameId: string;
    qty: number;
    unitPrice: number;
  }[];
  totalValue: number;
  cookId: string;
  tableId: string | (() => string) | null;
}
