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

  public getAvailableCookById(id: string): WorkerDTO {
    const foundWorker: Worker = this.getIfExisting(id);
    if (!foundWorker.isAvailable)
      throw new WorkersStoreError('This worker is not available', { id });
    return WorkerDTOMapper.mapToDTO(foundWorker);
  }

  public findAvailableWorker(searchedRole: Role): WorkerDTO | null {
    const workersArr: Worker[] = Array.from(
      this.workers,
      ([_, value]: [string, Worker]) => value
    );
    // Object.values
    const workerAvailable: Worker | undefined = workersArr.find(
      ({ role, isAvailable }: { role: Role; isAvailable: Boolean }) =>
        !!isAvailable && role === searchedRole
    );

    return workerAvailable ? WorkerDTOMapper.mapToDTO(workerAvailable) : null;
  }

  public findWorker(id: string): WorkerDTO {
    const foundWorker: Worker = this.getIfExisting(id);
    return WorkerDTOMapper.mapToDTO(foundWorker);
  }

  public addWorker({ name, role, isAvailable }: WorkerDTO): WorkerDTO {
    this.validateIfNameExists(name);
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
      name: name.trim().toUpperCase(),
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

  private validateIfNameExists(nameToValidate: string): void {
    const tablesArr: Worker[] = Array.from(this.workers, ([_, value]) => value);

    const foundTableIndex: number = tablesArr.findIndex(
      ({ name }: { name: string }) =>
        name === nameToValidate.trim().toUpperCase()
    );

    if (foundTableIndex >= 0)
      throw new WorkersStoreError(
        'Worker with passed name already exists, could not proceed.',
        { name: nameToValidate.trim().toUpperCase() }
      );
  }
}
