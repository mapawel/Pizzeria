import { Table } from '../Table/Table';
import { TablesStoreError } from '../exceptions/Tables-store.exception';
import { TableDTO } from '../DTO/Table.dto';
import { TableWithIdDTO } from '../DTO/Table-with-id.dto';
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

  public findTableByNameId(nameId: string): TableWithIdDTO {
    const foundTable: Table = this.getIfExisting(nameId);

    return TableDTOMapper.mapToResDTO(foundTable);
  }

  public addTable({
    name,
    sits,
    sitsAvailable,
    isAvailable,
  }: TableDTO): TableWithIdDTO {
    const table: Table = new Table(name, sits, sitsAvailable, isAvailable);
    this.tables.set(table.id, table);
    return TableDTOMapper.mapToResDTO(table);
  }

  public removeTable(id: string): boolean {
    const result: boolean = this.tables.delete(id);
    if (!result) this.throwValidateError(id);
    return true;
  }

  public updateTable({
    id,
    name,
    sits,
    sitsAvailable,
    isAvailable,
  }: TableWithIdDTO): TableWithIdDTO {
    const table: Table = this.getIfExisting(id);
    const newTable: Table = {
      ...table,
      name,
      sits,
      sitsAvailable,
      isAvailable,
    };
    this.tables.set(table.id, newTable);

    return TableDTOMapper.mapToResDTO(table);
  }

  public findFreeTable(person: number): TableWithIdDTO | null {
    let tableAvailable: Table | null = null;
    this.tables.forEach((table: Table) => {
      if (table.sitsAvailable >= person && table.isAvailable && !tableAvailable)
        tableAvailable = table;
    });
    if (!tableAvailable) return null;

    return TableDTOMapper.mapToResDTO(tableAvailable);
  }

  public checkIfAvailable(id: string): boolean {
    const currentTable = this.getIfExisting(id);
    return currentTable.isAvailable;
  }

  private throwValidateError(id: string): void {
    throw new TablesStoreError(
      'Table with passed id not found in store, could not proceed.',
      { id }
    );
  }

  private getIfExisting(id: string): Table {
    const foundWorker = this.tables.get(id);
    if (!foundWorker) this.throwValidateError(id);
    return foundWorker as Table;
  }
}
