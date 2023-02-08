import { TableDTO } from './DTO/Table.dto';
import { TableWithIdDTO } from './DTO/Table-with-id.dto';
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

  public findTableByNameId(id: string): TableWithIdDTO {
    return this.tables.findTableByNameId(id);
  }

  public addTable({
    name,
    sits,
    sitsAvailable,
    isAvailable,
  }: TableDTO): TableWithIdDTO {
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
  }: TableWithIdDTO): TableWithIdDTO {
    return this.tables.updateTable({
      id,
      name,
      sits,
      sitsAvailable,
      isAvailable,
    });
  }

  public findFreeTable(person: number): TableWithIdDTO | null {
    return this.tables.findFreeTable(person);
  }

  public checkIfAvailable(id: string): boolean {
    return this.tables.checkIfAvailable(id);
  }

  public makeTableFree(id: string, freeSits: number): boolean {
    const table: TableWithIdDTO = this.tables.findTableByNameId(id);

    this.tables.updateTable({
      ...table,
      sitsAvailable: table.sitsAvailable + freeSits,
      isAvailable: true,
    });

    return true;
  }
}
