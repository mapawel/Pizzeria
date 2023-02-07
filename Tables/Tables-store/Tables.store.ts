import { Table } from '../Table/Table';
import { TablesStoreError } from '../exceptions/Tables-store.exception';
import { TableDTO } from '../DTO/Table.dto';

export class TablesStore {
  private static instance: TablesStore | null;
  private readonly tables: Map<string, Table> = new Map();

  private constructor() {}

  public static getInstance() {
    if (TablesStore.instance) return TablesStore.instance;
    return (TablesStore.instance = new TablesStore());
  }

  public static resetInstance() {
    TablesStore.instance = null;
  }

  public findTableByNameId(nameId: string): TableDTO {
    const foundTable: Table = this.validateIfExisting(nameId);

    return {
      nameId: foundTable.nameId,
      sits: foundTable.sits,
      sitsAvailable: foundTable.sitsAvailable,
      isAvailable: foundTable.isAvailable,
    };
  }

  public addTable({
    nameId,
    sits,
    sitsAvailable,
    isAvailable,
  }: TableDTO): TableDTO {
    const table: Table = new Table(nameId, sits, sitsAvailable, isAvailable);
    const updatedMap: Map<string, Table> = this.tables.set(nameId, table);
    const addedTable: Table = updatedMap.get(nameId) as Table;

    return {
      nameId: addedTable.nameId,
      sits: addedTable.sits,
      sitsAvailable: addedTable.sitsAvailable,
      isAvailable: addedTable.isAvailable,
    };
  }

  public removeTable(nameId: string): boolean {
    this.validateIfExisting(nameId);
    this.tables.delete(nameId);
    return true;
  }

  public updateTable({
    nameId,
    sits,
    sitsAvailable,
    isAvailable,
  }: TableDTO): TableDTO {
    const table: Table = this.validateIfExisting(nameId);
    const updatedMap = this.tables.set(table.nameId, {
      ...table,
      nameId,
      sits,
      sitsAvailable,
      isAvailable,
    });
    const updatedTable: Table = updatedMap.get(table.nameId) as Table;

    return {
      nameId: updatedTable.nameId,
      sits: updatedTable.sits,
      sitsAvailable: updatedTable.sitsAvailable,
      isAvailable: updatedTable.isAvailable,
    };
  }

  public findFreeTable(person: number): TableDTO | null {
    let tableAvailable: Table | null = null;
    this.tables.forEach((table: Table) => {
      if (table.sitsAvailable >= person && table.isAvailable && !tableAvailable)
        tableAvailable = table;
    });
    if (!tableAvailable) return null;

    return {
      nameId: tableAvailable['nameId'],
      sits: tableAvailable['sits'],
      sitsAvailable: tableAvailable['sitsAvailable'],
      isAvailable: tableAvailable['isAvailable'],
    };
  }

  public checkIfAvailable(nameId: string): boolean {
    const currentTable = this.validateIfExisting(nameId);
    return currentTable.isAvailable;
  }

  private validateIfExisting(nameId: string): Table {
    const foundWorker = this.tables.get(nameId);
    if (!foundWorker)
      throw new TablesStoreError(
        'Table with passed id not found in store, could not proceed.',
        { nameId }
      );
    return foundWorker;
  }
}
