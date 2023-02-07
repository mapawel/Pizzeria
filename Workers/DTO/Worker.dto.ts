import { Role } from 'Workers/Worker/Roles.enum';

export interface WorkerDTO {
  id?: string,
  name: string;
  role: Role;
  isAvailable: boolean;
}
