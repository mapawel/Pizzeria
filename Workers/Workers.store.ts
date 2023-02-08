import { Worker } from './Worker/Worker';
import { WorkersStoreError } from './exceptions/Workers-store.exception';
import { Role } from './Worker/Roles.enum';
import { WorkerDTO } from './DTO/Worker.dto';
import { WorkerDTOMapper } from './DTO/Worker-dto.mapper';

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
    const foundWorker: Worker = this.getIfExisting(id);
    if (!foundWorker.isAvailable)
      throw new WorkersStoreError('This worker is not available', { id });
    return WorkerDTOMapper.mapToDTO(foundWorker);
  }

  public findAvailableWorker(role: Role): WorkerDTO | null {
    let workerAvailable: Worker | null = null;
    this.workers.forEach((worker: Worker) => {
      if (worker.role === role && worker.isAvailable && !workerAvailable)
        workerAvailable = worker;
    });
    if (!workerAvailable) return null;

    return WorkerDTOMapper.mapToDTO(workerAvailable);
  }

  public findWorker(id: string): WorkerDTO {
    const foundWorker: Worker = this.getIfExisting(id);
    return WorkerDTOMapper.mapToDTO(foundWorker);
  }

  public addWorker({ name, role, isAvailable }: WorkerDTO): WorkerDTO {
    const newWorker: Worker = new Worker(name, role, isAvailable);
    this.workers.set(newWorker.id, newWorker);

    return WorkerDTOMapper.mapToDTO(newWorker);
  }

  public removeWorker(id: string): boolean {
    const result: boolean = this.workers.delete(id);
    if (!result) this.throwValidateError(id);
    return true;
  }

  public updateWorker({ id, name, role, isAvailable }: WorkerDTO): WorkerDTO {
    if (!id)
      throw new WorkersStoreError('To update worker, worker id is required', {
        name,
      });
    const worker: Worker = this.getIfExisting(id);
    const newWorker: Worker = {
      ...worker,
      name,
      role,
      isAvailable,
    };
    this.workers.set(worker.id, newWorker);

    return WorkerDTOMapper.mapToDTO(newWorker);
  }

  private throwValidateError(id: string): void {
    throw new WorkersStoreError(
      'Worker with passed id not found in store, could not proceed.',
      { id }
    );
  }

  private getIfExisting(id: string): Worker {
    const foundWorker = this.workers.get(id);
    if (!foundWorker) this.throwValidateError(id);
    return foundWorker as Worker;
  }
}
