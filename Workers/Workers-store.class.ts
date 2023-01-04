import { DAOinterface } from 'DAO/DAO.interface';
import { WorkerItem } from './WorkerItem.type';
import { Worker } from './Worker/Worker.class';
import { WorkersStoreError } from './Workers-store.exception';
import { Role } from './Worker/Roles.enum';

export class WorkersStore
  implements DAOinterface<WorkerItem, Worker, boolean, null>
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
  //TODO to remove
  test() {
    return new Map(this.workers);
  }

  public findItemById(id: string): WorkerItem {
    return this.validateIfExisting(id);
  }

  public addOrUpdateItem(worker: Worker, isAvailable: boolean): boolean {
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
    isAvailable: boolean
  ): boolean {
    this.validateIfExisting(worker.id);
    this.workers.set(worker.name, {
      worker,
      isAvailable,
    });
    return true;
  }

  public findAvailableWorker(role: Role): WorkerItem {
    let workerAvailable: WorkerItem | null = null;
    this.workers.forEach((workerItem: WorkerItem, id: string) => {
      if (
        workerItem.worker.role === role &&
        workerItem.isAvailable &&
        !workerAvailable
      )
        workerAvailable = workerItem;
    });
    if (!workerAvailable)
      throw new WorkersStoreError('Cannot find any available worker specyfied.', {
        role,
      });
    return workerAvailable;
  }

  // private checkIfAvailable(id: string): boolean {
  //   const currentWorker = this.validateIfExisting(id);
  //   return currentWorker.isAvailable;
  // }

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
