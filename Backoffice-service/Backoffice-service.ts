import { WorkersStore } from '../Workers/Workers-store.class';
import { TablesStore } from '../Tables/Tables-store.class';
import { Worker } from 'Workers/Worker/Worker.class';
import { WorkerItem } from 'Workers/WorkerItem.type';
import { TableItem } from 'Tables/TableItem.type';
import { Table } from 'Tables/Table/Table.class';

export class BackofficeService {
  static instance: BackofficeService | null;
  private readonly workers: WorkersStore;
  private readonly tables: TablesStore;

  private constructor() {
    this.workers = WorkersStore.getInstance();
    this.tables = TablesStore.getInstance();
  }

  public static getInstance() {
    if (BackofficeService.instance) return BackofficeService.instance;
    return (BackofficeService.instance = new BackofficeService());
  }

  public static resetInstance() {
    BackofficeService.instance = null;
  }

  public getWorkerByName(name: string): WorkerItem {
    return this.workers.findItemById(name);
  }

  public addWorker(worker: Worker, isAvailable: boolean): boolean {
    return this.workers.addOrUpdateItem(worker, isAvailable);
  }

  public removeWorker(worker: Worker): boolean {
    return this.workers.removeExistingItem(worker);
  }

  public updateWorker(worker: Worker, isAvailable: boolean): boolean {
    return this.workers.updateExistingItemParam(worker, isAvailable);
  }

  public getTableById(id: string): TableItem {
    return this.tables.findItemById(id);
  }

  public addTable(
    table: Table,
    sitsToReserve: number,
    isAvailable: boolean
  ): boolean {
    return this.tables.addOrUpdateItem(table, sitsToReserve, isAvailable);
  }

  public removeTable(table: Table): boolean {
    return this.tables.removeExistingItem(table);
  }

  public updateTable(
    table: Table,
    sitsToReserve: number,
    isAvailable: boolean
  ): boolean {
    return this.tables.updateExistingItemParam(
      table,
      sitsToReserve,
      isAvailable
    );
  }
}
