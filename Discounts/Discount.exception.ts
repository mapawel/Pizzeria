export class DiscountError extends Error {
  constructor(
    readonly message: string,
    readonly payload?: { discountCode?: string; qty?: number }
  ) {
    super(message);
  }
}
