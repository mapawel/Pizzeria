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
    name,
    sits,
    sitsAvailable,
    isAvailable,
  }: TableDTO): TableDTO {
    this.validateIfNameExists(name);
    const table: Table = new Table(name, sits, sitsAvailable, isAvailable);
    this.tables.set(table.id, table);
    return TableDTOMapper.mapToDTO(table);
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
  }: TableDTO): TableDTO {
    const table: Table = this.getIfExisting(id ? id : '');
    const newTable: Table = {
      ...table,
      name,
      sits,
      sitsAvailable,
      isAvailable,
    };
    this.tables.set(table.id, newTable);

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
    const foundTable = this.tables.get(id);
    if (!foundTable) this.throwValidateError(id);
    return foundTable as Table;
  }

  private validateIfNameExists(nameToValidate: string): void {
    const tablesArr: Table[] = Array.from(this.tables, ([_, value]) => value);

    const foundTableIndex: number = tablesArr.findIndex(
      ({ name }: { name: string }) =>
        name === nameToValidate.trim().toLocaleLowerCase()
    );

    if (foundTableIndex >= 0)
      throw new TablesStoreError(
        'Table with passed name already exists, could not proceed.',
        { name: nameToValidate.trim().toLocaleLowerCase() }
      );
  }
}
