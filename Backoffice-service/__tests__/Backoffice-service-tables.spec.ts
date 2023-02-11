import { assert } from 'chai';
import { BackofficeService } from '../Backoffice.service';
import { ValidatorError } from '../../general-validators/Validator.exception';
import { TableDTO } from '../../Tables/DTO/Table.dto';
import { TablesStoreError } from '../../Tables/exceptions/Tables-store.exception';

describe('Backoffice service tests suite - tables methods:', () => {
  //setup
  let backoffice: BackofficeService;

  const tableName = '  BigRound';
  const tableNameNormalized = tableName.trim().toLowerCase();
  const tableSits = 6;
  const tableSitsAvailable = 6;
  const tableIsAvailable = true;

  beforeEach(() => {
    backoffice = BackofficeService.getInstance();
  });

  afterEach(() => {
    BackofficeService.resetInstance();
  });

  describe('addTable() + findTableById() test:', () => {
    it('should add table with specyfied params and then find this table by passed id', () => {
      //when
      const addedTable: TableDTO = backoffice.addTable({
        name: tableName,
        sits: tableSits,
        sitsAvailable: tableSitsAvailable,
        isAvailable: tableIsAvailable,
      });

      if (addedTable.id) {
        const assertedTable: TableDTO = backoffice.findTableById(addedTable.id);
        //then
        assert.equal(assertedTable.name, tableNameNormalized);
        assert.equal(assertedTable.sits, tableSits);
        assert.equal(assertedTable.sitsAvailable, tableSitsAvailable);
        assert.equal(assertedTable.isAvailable, tableIsAvailable);
      } else {
        assert.fail('Table id not found');
      }
    });

    it('should throw ValidatorError on try to add a new table with not proper sits (-)', () => {
      const newTableSits = -1;

      assert.throws(() => {
        backoffice.addTable({
          name: tableName,
          sits: newTableSits,
          sitsAvailable: tableSitsAvailable,
          isAvailable: tableIsAvailable,
        });
      }, ValidatorError);
    });

    it('should throw ValidatorError on try to add a table with not proper sits available (greather than sits)', () => {
      //given
      const newTableSitsAvailable = tableSits + 1;

      //when//then
      assert.throws(
        () =>
          backoffice.addTable({
            name: tableName,
            sits: tableSits,
            sitsAvailable: newTableSitsAvailable,
            isAvailable: tableIsAvailable,
          }),
        ValidatorError
      );
    });

    it('should throw DiscountError on try to find not existing discount', () => {
      //when//then
      assert.throws(
        () => backoffice.findTableById('nonExisting'),
        TablesStoreError
      );
    });
  });

  describe('removeTable() test:', () => {
    it('should remove a table by code', () => {
      //given
      const addedTable: TableDTO = backoffice.addTable({
        name: tableName,
        sits: tableSits,
        sitsAvailable: tableSitsAvailable,
        isAvailable: tableIsAvailable,
      });

      if (addedTable.id) {
        backoffice.findTableById(addedTable.id);
        //when
        backoffice.removeTable(addedTable.id);
        //then
        assert.throws(() => {
          backoffice.findTableById(addedTable.id as string);
        }, TablesStoreError);
      } else {
        assert.fail('Table id not found');
      }
    });

    it('should throw DiscountError on try to remove not existing discount', () => {
      //when//then
      assert.throws(
        () => backoffice.removeTable('nonExisting'),
        TablesStoreError
      );
    });
  });

  describe('updateTable() test:', () => {
    //given
    const newTableName = '  newBigRound';
    const newTableNomalizedName = newTableName.trim().toLowerCase();
    const newTableSits = 8;
    const newTableSitsAvailable = 8;
    const newTableIsAvailable = false;

    it('should update a table with new params', () => {
      const addedTable: TableDTO = backoffice.addTable({
        name: tableName,
        sits: tableSits,
        sitsAvailable: tableSitsAvailable,
        isAvailable: tableIsAvailable,
      });

      if (addedTable.id) {
        //when
        backoffice.updateTable({
          id: addedTable.id,
          name: newTableName,
          sits: newTableSits,
          sitsAvailable: newTableSitsAvailable,
          isAvailable: newTableIsAvailable,
        });
        //then
        const assertedTable: TableDTO = backoffice.findTableById(addedTable.id);
        assert.equal(assertedTable.name, newTableNomalizedName);
        assert.equal(assertedTable.sits, newTableSits);
        assert.equal(assertedTable.sitsAvailable, newTableSitsAvailable);
        assert.equal(assertedTable.isAvailable, newTableIsAvailable);
      } else {
        assert.fail('Table id not found');
      }
    });

    it('should throw ValidatorError on try to update a table with not proper sits qty (-)', () => {
      //given
      const newTableSits = -10;
      const addedTable: TableDTO = backoffice.addTable({
        name: tableName,
        sits: tableSits,
        sitsAvailable: tableSitsAvailable,
        isAvailable: tableIsAvailable,
      });

      if (addedTable.id) {
        //when//then
        assert.throws(
          () =>
            backoffice.updateTable({
              id: addedTable.id,
              name: tableName,
              sits: newTableSits,
              sitsAvailable: tableSitsAvailable,
              isAvailable: tableIsAvailable,
            }),
          ValidatorError
        );
      } else {
        assert.fail('Table id not found');
      }
    });

    it('should throw ValidatorError on try to update a table with not proper sits available (greather than sits)', () => {
      //given
      const newTableSitsAvailable = tableSits + 1;
      const addedTable: TableDTO = backoffice.addTable({
        name: tableName,
        sits: tableSits,
        sitsAvailable: tableSitsAvailable,
        isAvailable: tableIsAvailable,
      });

      if (addedTable.id) {
        //when//then
        assert.throws(
          () =>
            backoffice.updateTable({
              id: addedTable.id,
              name: tableName,
              sits: tableSits,
              sitsAvailable: newTableSitsAvailable,
              isAvailable: tableIsAvailable,
            }),
          ValidatorError
        );
      } else {
        assert.fail('Table id not found');
      }
    });

    it('should throw TablesStoreError on try to update not existing table', () => {
      //when//then
      assert.throws(
        () =>
          backoffice.updateTable({
            id: 'nonExisting',
            name: newTableName,
            sits: newTableSits,
            sitsAvailable: newTableSitsAvailable,
            isAvailable: newTableIsAvailable,
          }),
        TablesStoreError
      );
    });
  });
});
