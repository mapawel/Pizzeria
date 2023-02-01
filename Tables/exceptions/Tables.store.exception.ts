export class TablesStoreError extends Error {
  constructor(
    readonly message: string,
    readonly payload?: { nameId?: string }
  ) {
    super(message);
  }
}
