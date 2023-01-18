import { IDA } from 'Data-access/DA.interface';
import { WorkerItem } from './Worker-item.type';
import { Worker } from './Worker/Worker.class';
import { WorkersStoreError } from './Workers.store.exception';
import { Role } from './Worker/Roles.enum';

export class WorkersStore
  implements IDA<WorkerItem, Worker, { isAvailable: boolean }>
{
  static instance: WorkersStore | null;
  private readonly workers: Map<string, WorkerItem> = new Map();

  private constructor() {}

  public static getInstance() {
    if (WorkersStore.instance) return WorkersStore.instance;
    return (WorkersStore.instance = new WorkersStore());
  }

  public static resetInstance() {
    WorkersStore.instance = null;
  }

  public findItemById(id: string): WorkerItem {
    return this.validateIfExisting(id);
  }

  public addOrUpdateItem(
    worker: Worker,
    { isAvailable }: { isAvailable: boolean }
  ): boolean {
    this.workers.set(worker.name, {
      worker,
      isAvailable,
    });
    return true;
  }

  public removeExistingItem(worker: Worker): boolean {
    this.validateIfExisting(worker.id);
    this.workers.delete(worker.id);
    return true;
  }

  public updateExistingItemParam(
    worker: Worker,
    { isAvailable }: { isAvailable: boolean }
  ): boolean {
    this.validateIfExisting(worker.id);
    this.workers.set(worker.name, {
      worker,
      isAvailable,
    });
    return true;
  }

  public findAvailableWorker(role: Role): WorkerItem | null {
    let workerAvailable: WorkerItem | null = null;
    this.workers.forEach((workerItem: WorkerItem, id: string) => {
      if (
        workerItem.worker.role === role &&
        workerItem.isAvailable &&
        !workerAvailable
      )
        workerAvailable = workerItem;
    });
    if (!workerAvailable) return null;
    return workerAvailable;
  }

  private validateIfExisting(id: string): WorkerItem {
    const foundWorker = this.workers.get(id);
    if (!foundWorker)
      throw new WorkersStoreError(
        'Worker with passed id not found in store, could not proceed.',
        { id }
      );
    return foundWorker;
  }
}
