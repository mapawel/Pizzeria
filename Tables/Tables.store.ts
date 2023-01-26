import { IDA } from 'Data-access/DA.interface';
import { WorkerItem } from 'Workers/Worker-item.type';
import { Table } from './Table/Table.class';
import { TableItem } from './Table-item.type';
import { TablesStoreError } from './Tables.store.exception';

export class TablesStore
  implements
    IDA<TableItem, Table, { sitsToReserve: number; isAvailable: boolean }>
{
  private static instance: TablesStore | null;
  private readonly tables: Map<string, TableItem> = new Map();

  private constructor() {}

  public static getInstance() {
    if (TablesStore.instance) return TablesStore.instance;
    return (TablesStore.instance = new TablesStore());
  }

  public static resetInstance() {
    TablesStore.instance = null;
  }

  public findItemById(id: string): TableItem {
    return this.validateIfExisting(id);
  }

  public addOrUpdateItem(
    table: Table,
    {
      sitsToReserve,
      isAvailable,
    }: { sitsToReserve: number; isAvailable: boolean }
  ): TableItem {
    const updatedMap = this.tables.set(table.id, {
      table,
      sitsAvailable: table.sits - sitsToReserve,
      isAvailable,
    });
    return updatedMap.get(table.id) as TableItem;
  }

  public removeExistingItem(tableId: string): boolean {
    this.validateIfExisting(tableId);
    this.tables.delete(tableId);
    return true;
  }

  public updateExistingItemParam(
    tableId: string,
    {
      sitsToReserve,
      isAvailable,
    }: { sitsToReserve: number; isAvailable: boolean }
  ): TableItem {
    const tableItem: TableItem = this.validateIfExisting(tableId);
    const updatedMap = this.tables.set(tableId, {
      table: tableItem.table,
      sitsAvailable: tableItem.table.sits - sitsToReserve,
      isAvailable,
    });
    return updatedMap.get(tableId) as TableItem;
  }

  public findFreeTable(person: number): TableItem | null {
    let tableAvailable: TableItem | null = null;
    this.tables.forEach((tableItem: TableItem, id: string) => {
      if (
        tableItem.sitsAvailable >= person &&
        tableItem.isAvailable &&
        !tableAvailable
      )
        tableAvailable = tableItem;
    });
    if (!tableAvailable) return null;
    return tableAvailable;
  }

  public checkIfAvailable(id: string): boolean {
    const currentTable = this.validateIfExisting(id);
    return currentTable.isAvailable;
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
