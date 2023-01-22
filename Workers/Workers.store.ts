import { IDA } from 'Data-access/DA.interface';
import { WorkerItem } from './Worker-item.type';
import { Worker } from './Worker/Worker.class';
import { WorkersStoreError } from './Workers.store.exception';
import { Role } from './Worker/Roles.enum';

export class WorkersStore
  implements IDA<WorkerItem, Worker, { isAvailable: boolean }>
{
  private static instance: WorkersStore | null;
  private readonly workers: Map<string, WorkerItem> = new Map();

  private constructor() {}

  public static getInstance() {
    if (WorkersStore.instance) return WorkersStore.instance;
    return (WorkersStore.instance = new WorkersStore());
  }

  public static resetInstance() {
    WorkersStore.instance = null;
  }

  public findAvailableCookById(id: string): WorkerItem {
    const foundWorker: WorkerItem = this.validateIfExisting(id);
    if (!foundWorker.isAvailable)
      throw new WorkersStoreError('This worker is not available', { id });
    return foundWorker;
  }

  public findItemById(id: string): WorkerItem {
    return this.validateIfExisting(id);
  }

  public addOrUpdateItem(
    worker: Worker,
    { isAvailable }: { isAvailable: boolean }
  ): WorkerItem {
    const updatedMap = this.workers.set(worker.id, {
      worker,
      isAvailable,
    });
    return updatedMap.get(worker.id) as WorkerItem;
  }

  public removeExistingItem(worker: Worker): boolean {
    this.validateIfExisting(worker.id);
    this.workers.delete(worker.id);
    return true;
  }

  public updateExistingItemParam(
    worker: Worker,
    { isAvailable }: { isAvailable: boolean }
  ): WorkerItem {
    this.validateIfExisting(worker.id);
    const updatedMap = this.workers.set(worker.id, {
      worker,
      isAvailable,
    });
    return updatedMap.get(worker.id) as WorkerItem;
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
