import { Table } from "./Table/Table.class";

export class TablesStoreError extends Error {
  constructor(
    readonly message: string,
    readonly payload?: { id?: string; table?: Table }
  ) {
    super(message);
  }
}
