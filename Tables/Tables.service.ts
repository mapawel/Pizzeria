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

  public findTableByNameId(id: string): TableDTO {
    return this.tables.findTableByNameId(id);
  }

  public addTable({
    name,
    sits,
    sitsAvailable,
    isAvailable,
  }: TableDTO): TableDTO {
    return this.tables.addTable({
      name,
      sits,
      sitsAvailable,
      isAvailable,
    });
  }

  public removeTable(id: string): boolean {
    return this.tables.removeTable(id);
  }

  public updateTable({
    id,
    name,
    sits,
    sitsAvailable,
    isAvailable,
  }: TableDTO): TableDTO {
    return this.tables.updateTable({
      id,
      name,
      sits,
      sitsAvailable,
      isAvailable,
    });
  }

  public findFreeTable(person: number): TableDTO | null {
    return this.tables.findFreeTable(person);
  }

  public checkIfAvailable(id: string): boolean {
    return this.tables.checkIfAvailable(id);
  }

  public makeTableFree(id: string, freeSits: number): boolean {
    const table: TableDTO = this.tables.findTableByNameId(id);

    this.tables.updateTable({
      ...table,
      sitsAvailable: table.sitsAvailable + freeSits,
      isAvailable: true,
    });

    return true;
  }
}
