export interface OrderResDTO {
  id: string;
  orderItems: {
    pizzaNameId: string;
    qty: number;
  }[];
  totalValue: number;
  cookId: string | null;
  tableNameId: string | (() => string) | null;
  tablePerson: number | null;
}
