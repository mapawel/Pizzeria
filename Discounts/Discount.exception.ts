export class DiscountError extends Error {
  constructor(
    readonly message: string,
    readonly payload?: { code?: string; qty?: number }
  ) {
    super(message);
  }
}
