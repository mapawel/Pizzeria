import { DAOinterface } from 'DAO/DAO.interface';
import { WorkerItem } from './WorkerItem.type';
import { Worker } from './Worker/Worker.class';
import { WorkersStoreError } from './Workers-store.exception';

export class WorkersStore
  implements DAOinterface<WorkerItem, Worker, null, null>
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

  test(){
    return new Map(this.workers)
  }

  public findItemById(id: string): WorkerItem {
    return this.validateIfExisting(id);
  }

  public addOrUpdateItem(worker: Worker): boolean {
    this.workers.set(worker.name, {
      worker,
      isAvailable: true,
      resetAvailableTime: null,
    });
    return true;
  }

  public removeExistingItem(worker: Worker): boolean {
    this.validateIfExisting(worker.id);
    this.workers.delete(worker.id);
    return true;
  }

  public updateExistingItemParam(worker: Worker): boolean {
    this.validateIfExisting(worker.id);
    this.workers.set(worker.name, {
      worker,
      isAvailable: true,
      resetAvailableTime: null,
    });
    return true;
  }

  public checkIfAvailable(id: string): boolean {
    const currentWorker = this.validateIfExisting(id);
    return currentWorker.isAvailable;
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
