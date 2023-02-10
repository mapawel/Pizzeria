import { assert } from 'chai';
import { BackofficeService } from '../Backoffice.service';
import { ValidatorError } from '../../general-validators/Validator.exception';
import { DiscountResDTO } from '../../Discounts/DTO/Discount-res.dto';
import { DiscountError } from '../../Discounts/exceptions/Discount.exception';

describe('Backoffice service tests suite - discounts methods:', () => {
  //setup
  let backoffice: BackofficeService;

  const discountCode = '   qwertY   ';
  const normalizedDiscountCode = discountCode.trim().toUpperCase();
  const discountPercent = 0.5;
  const discountLimit = 1;

  beforeEach(() => {
    backoffice = BackofficeService.getInstance();
  });

  afterEach(() => {
    BackofficeService.resetInstance();
  });

  describe('addDiscount() + findDiscountByCode() test:', () => {
    it('should add discount with specyfied percentage and not limited by qty and then find this discount by passed code', () => {
      //when
      backoffice.addDiscount(discountCode, discountPercent);

      const assertedDiscount: DiscountResDTO =
        backoffice.findDiscountByCode(discountCode);

      //then
      assert.equal(assertedDiscount.code, normalizedDiscountCode);
      assert.equal(assertedDiscount.discountPercent, discountPercent);
      assert.isNull(assertedDiscount.limitQty);
    });

    it('should add discount with specyfied percentage and limited qty and then find this discount by passed code', () => {
      //when
      backoffice.addDiscount(discountCode, discountPercent, discountLimit);

      const assertedDiscount: DiscountResDTO =
        backoffice.findDiscountByCode(discountCode);

      //then
      assert.equal(assertedDiscount.code, normalizedDiscountCode);
      assert.equal(assertedDiscount.discountPercent, discountPercent);
      assert.equal(assertedDiscount.limitQty, discountLimit);
    });

    it('should throw ValidatorError on try to add a new discount with not proper limit qty (-)', () => {
      const newDiscountLimit = -1;

      assert.throws(() => {
        backoffice.addDiscount(discountCode, discountPercent, newDiscountLimit);
      }, ValidatorError);
    });

    it('should throw DiscountError on try to find not existing discount', () => {
      //when//then
      assert.throws(
        () => backoffice.findDiscountByCode('nonExisting'),
        DiscountError
      );
    });
  });

  describe('removeDiscount() test:', () => {
    it('should remove discount by code', () => {
      //given
      backoffice.addDiscount(discountCode, discountPercent);
      backoffice.findDiscountByCode(discountCode);

      //when
      backoffice.removeDiscount(normalizedDiscountCode);
      //then

      assert.throws(
        () => backoffice.findDiscountByCode(discountCode),
        DiscountError
      );
    });

    it('should throw DiscountError on try to remove not existing discount', () => {
      //when//then
      assert.throws(
        () => backoffice.removeDiscount('nonExisting'),
        DiscountError
      );
    });
  });

  describe('updatePizza() test:', () => {
    it('should update discount with new params', () => {
      //given
      const newDiscountPercent = 0.3;
      const newDiscountLimit = 100;

      backoffice.addDiscount(discountCode, discountPercent, discountLimit);

      //when

      backoffice.updateDiscount(
        discountCode,
        newDiscountPercent,
        newDiscountLimit
      );

      const assertedDiscount: DiscountResDTO =
        backoffice.findDiscountByCode(discountCode);

      //then
      assert.equal(assertedDiscount.code, normalizedDiscountCode);
      assert.equal(assertedDiscount.discountPercent, newDiscountPercent);
      assert.equal(assertedDiscount.limitQty, newDiscountLimit);
    });

    it('should throw ValidatorError on try to update a discount with not proper limit qty (-)', () => {
      //given
      const newDiscountLimit = -10;

      backoffice.addDiscount(discountCode, discountPercent, discountLimit);

      //when

      //then
      assert.throws(() => {
        backoffice.updateDiscount(
          discountCode,
          discountPercent,
          newDiscountLimit
        );
      }, ValidatorError);
    });

    it('should throw DiscountStoreError on try to update not existing discount', () => {
      //when//then
      assert.throws(
        () =>
          backoffice.updateDiscount(
            'nonExisting',
            discountPercent,
            discountLimit
          ),
        DiscountError
      );
    });
  });
});
