import { assert } from 'chai';
import { BackofficeService } from '../Backoffice.service';
import { Role } from '../../Workers/Worker/Roles.enum';
import { WorkerDTO } from '../../Workers/DTO/Worker.dto';
import { WorkersStoreError } from '../../Workers/exceptions/Workers-store.exception';

describe('Backoffice service tests suite - workers methods:', () => {
  //setup
  let backoffice: BackofficeService;
  const workerName: string = ' John doe  ';
  const workerNormalizedName: string = workerName.trim().toUpperCase();
  const workerRole: Role = Role.COOK;
  const workerIsAvailable: boolean = true;

  beforeEach(() => {
    backoffice = BackofficeService.getInstance();
  });

  afterEach(() => {
    BackofficeService.resetInstance();
  });

  describe('addWorker() + findWorker() test:', () => {
    it('should add a worker with specyfied params and then find this worker by passed id', () => {
      //when
      const addedWorker: WorkerDTO = backoffice.addWorker({
        name: workerName,
        role: workerRole,
        isAvailable: workerIsAvailable,
      });

      if (addedWorker.id) {
        //when+then
        const assertedWorker: WorkerDTO = backoffice.findWorker(addedWorker.id);
        //...then
        assert.equal(assertedWorker.name, workerNormalizedName);
        assert.equal(assertedWorker.role, workerRole);
        assert.equal(assertedWorker.isAvailable, workerIsAvailable);
      } else {
        assert.fail('Worker id not found');
      }
    });

    it('should throw WorkersStoreError on try to find not existing worker', () => {
      //when//then
      assert.throws(
        () => backoffice.findWorker('nonExisting'),
        WorkersStoreError
      );
    });
  });

  describe('removeWorker() test:', () => {
    it('should remove a worker by id', () => {
      //given
      const addedWorker: WorkerDTO = backoffice.addWorker({
        name: workerName,
        role: workerRole,
        isAvailable: workerIsAvailable,
      });

      if (addedWorker.id) {
        backoffice.findWorker(addedWorker.id);

        //when
        backoffice.removeWorker(addedWorker.id);

        //then
        assert.throws(() => {
          backoffice.findWorker(addedWorker.id as string);
        }, WorkersStoreError);
      } else {
        assert.fail('Worker id not found');
      }
    });

    it('should throw WorkersStoreError on try to remove not existing worker', () => {
      //when//then
      assert.throws(
        () => backoffice.removeWorker('nonExisting'),
        WorkersStoreError
      );
    });
  });

  describe('updateWorker() test:', () => {
    //given
    const newWorkerName: string = ' Mat doe  ';
    const newWorkerNormalizedName: string = newWorkerName.trim().toUpperCase();
    const newWorkerRole: Role = Role.WAITER;
    const newWorkerIsAvailable: boolean = false;

    it('should update a worker with new params', () => {
      const addedWorker: WorkerDTO = backoffice.addWorker({
        name: workerName,
        role: workerRole,
        isAvailable: workerIsAvailable,
      });

      if (addedWorker.id) {
        //when
        backoffice.updateWorker({
          id: addedWorker.id,
          name: newWorkerName,
          role: newWorkerRole,
          isAvailable: newWorkerIsAvailable,
        });

        //then
        const assertedWorker: WorkerDTO = backoffice.findWorker(addedWorker.id);
        assert.equal(assertedWorker.name, newWorkerNormalizedName);
        assert.equal(assertedWorker.role, newWorkerRole);
        assert.equal(assertedWorker.isAvailable, newWorkerIsAvailable);
      } else {
        assert.fail('Worker id not found');
      }
    });

    it('should throw WorkersStoreError on try to update not existing worker', () => {
      //when//then
      assert.throws(
        () =>
          backoffice.updateWorker({
            id: 'nonExisting',
            name: workerName,
            role: workerRole,
            isAvailable: workerIsAvailable,
          }),
        WorkersStoreError
      );
    });
  });
});
