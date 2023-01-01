import { Worker } from './Worker/Worker.class';

export type WorkerItem = {
  worker: Worker;
  isAvailable: boolean;
  resetAvailableTime: Date | null;
};
