import { DAOinterface } from 'DAO/DAO.interface';
import { Table } from './Table/Table.class';
import { TableItem } from './TableItem.type';
import { TablesStoreError } from './Tables-store.exception';

export class TablesStore
  implements DAOinterface<TableItem, Table, number, boolean>
{
  static instance: TablesStore | null;
  private readonly tables: Map<string, TableItem> = new Map();

  private constructor() {}

  public static getInstance() {
    if (TablesStore.instance) return TablesStore.instance;
    return (TablesStore.instance = new TablesStore());
  }

  public static resetInstance() {
    TablesStore.instance = null;
  }
  //TODO to remove
  test() {
    return new Map(this.tables);
  }

  public findItemById(id: string): TableItem {
    return this.validateIfExisting(id);
  }

  public addOrUpdateItem(
    table: Table,
    sitsToReserve: number,
    isAvailable: boolean
  ): boolean {
    this.tables.set(table.id, {
      table,
      sitsAvailable: table.sits - sitsToReserve,
      isAvailable,
    });
    return true;
  }

  public removeExistingItem(table: Table): boolean {
    this.validateIfExisting(table.id);
    this.tables.delete(table.id);
    return true;
  }

  public updateExistingItemParam(
    table: Table,
    sitsToReserve: number,
    isAvailable: boolean
  ): boolean {
    this.validateIfExisting(table.id);
    this.tables.set(table.id, {
      table,
      sitsAvailable: table.sits - sitsToReserve,
      isAvailable,
    });
    return true;
  }

  public checkIfAvailable(id: string): boolean {
    const currentWorker = this.validateIfExisting(id);
    return currentWorker.isAvailable;
  }

  private validateIfExisting(id: string): TableItem {
    const foundWorker = this.tables.get(id);
    if (!foundWorker)
      throw new TablesStoreError(
        'Table with passed id not found in store, could not proceed.',
        { id }
      );
    return foundWorker;
  }
}
