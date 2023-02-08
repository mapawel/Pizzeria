import { Table } from '../Table/Table';
import { TablesStoreError } from '../exceptions/Tables-store.exception';
import { TableDTO } from '../DTO/Table.dto';
import { TableDTOMapper } from '../DTO/Table-dto.mapper';

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
    const foundTable: Table = this.getIfExisting(nameId);

    return TableDTOMapper.mapToDTO(foundTable);
  }

  public addTable({
    nameId,
    sits,
    sitsAvailable,
    isAvailable,
  }: TableDTO): TableDTO {
    const table: Table = new Table(nameId, sits, sitsAvailable, isAvailable);
    this.tables.set(nameId, table);

    return TableDTOMapper.mapToDTO(table);
  }

  public removeTable(nameId: string): boolean {
    const result: boolean = this.tables.delete(nameId);
    if (!result) this.throwValidateError(nameId);
    return true;
  }

  public updateTable({
    nameId,
    sits,
    sitsAvailable,
    isAvailable,
  }: TableDTO): TableDTO {
    const table: Table = this.getIfExisting(nameId);
    const newTable: Table = {
      ...table,
      nameId,
      sits,
      sitsAvailable,
      isAvailable,
    };
    this.tables.set(table.nameId, newTable);

    return TableDTOMapper.mapToDTO(table);
  }

  public findFreeTable(person: number): TableDTO | null {
    let tableAvailable: Table | null = null;
    this.tables.forEach((table: Table) => {
      if (table.sitsAvailable >= person && table.isAvailable && !tableAvailable)
        tableAvailable = table;
    });
    if (!tableAvailable) return null;

    return TableDTOMapper.mapToDTO(tableAvailable);
  }

  public checkIfAvailable(nameId: string): boolean {
    const currentTable = this.getIfExisting(nameId);
    return currentTable.isAvailable;
  }

  private throwValidateError(nameId: string): void {
    throw new TablesStoreError(
      'Table with passed id not found in store, could not proceed.',
      { nameId }
    );
  }

  private getIfExisting(nameId: string): Table {
    const foundWorker = this.tables.get(nameId);
    if (!foundWorker) this.throwValidateError(nameId);
    return foundWorker as Table;
  }
}
