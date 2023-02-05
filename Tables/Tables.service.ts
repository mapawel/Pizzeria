import { TableDTO } from './DTO/Table.dto';
import { TablesStore } from './Tables-store/Tables.store';

export class TablesService {
  private static instance: TablesService | null;
  private readonly tables: TablesStore;

  private constructor() {
    this.tables = TablesStore.getInstance();
  }

  public static getInstance() {
    if (TablesService.instance) return TablesService.instance;
    return (TablesService.instance = new TablesService());
  }

  public static resetInstance() {
    TablesService.instance = null;
  }

  public findTableByNameId(nameId: string): TableDTO {
    return this.tables.findTableByNameId(nameId);
  }

  public addTable({
    nameId,
    sits,
    sitsAvailable,
    isAvailable,
  }: TableDTO): TableDTO {
    return this.tables.addTable({
      nameId,
      sits,
      sitsAvailable,
      isAvailable,
    });
  }

  public removeTable(nameId: string): boolean {
    return this.tables.removeTable(nameId);
  }

  public updateTable({
    nameId,
    sits,
    sitsAvailable,
    isAvailable,
  }: TableDTO): TableDTO {
    return this.tables.updateTable({
      nameId,
      sits,
      sitsAvailable,
      isAvailable,
    });
  }

  public findFreeTable(person: number): TableDTO | null {
    return this.tables.findFreeTable(person);
  }

  public checkIfAvailable(nameId: string): boolean {
    return this.tables.checkIfAvailable(nameId)
  }

  public makeTableFree(tableNameId: string, freeSits: number): boolean {
    const table: TableDTO = this.tables.findTableByNameId(tableNameId);

    this.tables.updateTable({
      ...table,
      sitsAvailable: table.sitsAvailable + freeSits,
      isAvailable: true,
    });

    return true;
  }
}
