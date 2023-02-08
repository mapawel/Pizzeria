export class TablesStoreError extends Error {
  constructor(
    readonly message: string,
    readonly payload?: { id?: string, name?: string }
  ) {
    super(message);
  }
}
