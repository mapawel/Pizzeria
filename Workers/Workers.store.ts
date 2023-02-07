import { Worker } from './Worker/Worker';
import { WorkersStoreError } from './exceptions/Workers-store.exception';
import { Role } from './Worker/Roles.enum';
import { WorkerDTO } from './DTO/Worker.dto';

export class WorkersStore {
  private static instance: WorkersStore | null;
  private readonly workers: Map<string, Worker> = new Map();

  private constructor() {}

  public static getInstance() {
    if (WorkersStore.instance) return WorkersStore.instance;
    return (WorkersStore.instance = new WorkersStore());
  }

  public static resetInstance() {
    WorkersStore.instance = null;
  }

  public findAvailableCookById(id: string): WorkerDTO {
    const foundWorker: Worker = this.validateIfExisting(id);
    if (!foundWorker.isAvailable)
      throw new WorkersStoreError('This worker is not available', { id });
    return {
      id: foundWorker.id,
      name: foundWorker.name,
      role: foundWorker.role,
      isAvailable: foundWorker.isAvailable,
    };
  }

  public findAvailableWorker(role: Role): WorkerDTO | null {
    let workerAvailable: Worker | null = null;
    this.workers.forEach((worker: Worker) => {
      if (worker.role === role && worker.isAvailable && !workerAvailable)
        workerAvailable = worker;
    });
    if (!workerAvailable) return null;

    return {
      id: workerAvailable['id'],
      name: workerAvailable['name'],
      role: workerAvailable['role'],
      isAvailable: workerAvailable['isAvailable'],
    };
  }

  public findWorker(id: string): WorkerDTO {
    const foundWorker: Worker = this.validateIfExisting(id);

    return {
      id: foundWorker.id,
      name: foundWorker.name,
      role: foundWorker.role,
      isAvailable: foundWorker.isAvailable,
    };
  }

  public addWorker({ name, role, isAvailable }: WorkerDTO): WorkerDTO {
    const newWorker: Worker = new Worker(name, role, isAvailable);
    const updatedMap = this.workers.set(newWorker.id, newWorker);
    const addedWorker: Worker = updatedMap.get(newWorker.id) as Worker;

    return {
      id: addedWorker.id,
      name: addedWorker.name,
      role: addedWorker.role,
      isAvailable: addedWorker.isAvailable,
    };
  }

  public removeWorker(id: string): boolean {
    this.validateIfExisting(id);
    this.workers.delete(id);
    return true;
  }

  public updateWorker({ id, name, role, isAvailable }: WorkerDTO): WorkerDTO {
    if (!id)
      throw new WorkersStoreError('To update worker, worker id is required', {
        name,
      });
    const worker: Worker = this.validateIfExisting(id);
    const updatedMap = this.workers.set(worker.id, {
      ...worker,
      name,
      role,
      isAvailable,
    });
    const updatedWorker: Worker = updatedMap.get(worker.id) as Worker;

    return {
      name: updatedWorker.name,
      role: updatedWorker.role,
      isAvailable: updatedWorker.isAvailable,
    };
  }

  private validateIfExisting(id: string): Worker {
    const foundWorker = this.workers.get(id);
    if (!foundWorker)
      throw new WorkersStoreError(
        'Worker with passed id not found in store, could not proceed.',
        { id }
      );
    return foundWorker;
  }
}
