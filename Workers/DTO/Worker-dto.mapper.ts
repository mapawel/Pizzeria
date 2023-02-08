import { WorkerDTO } from './Worker.dto';
import { Worker } from '../Worker/Worker';

export class WorkerDTOMapper {
  public static mapToDTO(worker: Worker): WorkerDTO {
    return {
      id: worker.id,
      name: worker.name,
      role: worker.role,
      isAvailable: worker.isAvailable,
    };
  }
}
