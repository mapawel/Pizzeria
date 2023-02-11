import { assert } from 'chai';
import { BackofficeService } from '../Backoffice.service';
import { ValidatorError } from '../../general-validators/Validator.exception';
import { TableDTO } from '../../Tables/DTO/Table.dto';

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
  });

  // it('should throw DiscountError on try to find not existing discount', () => {
  //   //when//then
  //   assert.throws(
  //     () => backoffice.findDiscountByCode('nonExisting'),
  //     DiscountError
  //   );
  // });

  // describe('removeDiscount() test:', () => {
  //   it('should remove discount by code', () => {
  //     //given
  //     backoffice.addDiscount(discountCode, discountPercent);
  //     backoffice.findDiscountByCode(discountCode);

  //     //when
  //     backoffice.removeDiscount(normalizedDiscountCode);
  //     //then

  //     assert.throws(
  //       () => backoffice.findDiscountByCode(discountCode),
  //       DiscountError
  //     );
  //   });

  //   it('should throw DiscountError on try to remove not existing discount', () => {
  //     //when//then
  //     assert.throws(
  //       () => backoffice.removeDiscount('nonExisting'),
  //       DiscountError
  //     );
  //   });
  // });

  // describe('updatePizza() test:', () => {
  //   it('should update discount with new params', () => {
  //     //given
  //     const newDiscountPercent = 0.3;
  //     const newDiscountLimit = 100;

  //     backoffice.addDiscount(discountCode, discountPercent, discountLimit);

  //     //when

  //     backoffice.updateDiscount(
  //       discountCode,
  //       newDiscountPercent,
  //       newDiscountLimit
  //     );

  //     const assertedDiscount: DiscountResDTO =
  //       backoffice.findDiscountByCode(discountCode);

  //     //then
  //     assert.equal(assertedDiscount.code, normalizedDiscountCode);
  //     assert.equal(assertedDiscount.discountPercent, newDiscountPercent);
  //     assert.equal(assertedDiscount.limitQty, newDiscountLimit);
  //   });

  //   it('should throw ValidatorError on try to update a discount with not proper limit qty (-)', () => {
  //     //given
  //     const newDiscountLimit = -10;

  //     backoffice.addDiscount(discountCode, discountPercent, discountLimit);

  //     //when

  //     //then
  //     assert.throws(() => {
  //       backoffice.updateDiscount(
  //         discountCode,
  //         discountPercent,
  //         newDiscountLimit
  //       );
  //     }, ValidatorError);
  //   });

  //   it('should throw DiscountStoreError on try to update not existing discount', () => {
  //     //when//then
  //     assert.throws(
  //       () =>
  //         backoffice.updateDiscount(
  //           'nonExisting',
  //           discountPercent,
  //           discountLimit
  //         ),
  //       DiscountError
  //     );
  //   });
  // });
});
