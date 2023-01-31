export class ValidatorError extends Error {
  constructor(
    readonly message: string,
    readonly payload?: {
      number: number;
    }
  ) {
    super(message);
  }
}
