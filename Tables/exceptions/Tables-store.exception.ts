export class TablesStoreError extends Error {
  constructor(
    readonly message: string,
    readonly payload?: { id?: string }
  ) {
    super(message);
  }
}
