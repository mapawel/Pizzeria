export interface DiscountResDTO {
  code: string;
  discountPercent: number;
  limitQty: number | (() => number) | null;
}
