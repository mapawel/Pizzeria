import { assert } from 'chai';
import { Ingredient } from 'Kitchen/interfaces/Ingredient.interface';
import { BackofficeService } from '../Backoffice.service';
import { IngretientStoreError } from '../../Kitchen/Ingredients/exceptions/Ingredient-store.exception';
import { ValidatorError } from '../../general-validators/Validator.exception';

describe('Backoffice service tests suite - ingredients methods:', () => {
  //setup
  let backoffice: BackofficeService;
  const ingredientName: string = 'Sose';
  const ingredientQty: number = 1000;

  beforeEach(() => {
    backoffice = BackofficeService.getInstance();
  });

  afterEach(() => {
    BackofficeService.resetInstance();
  });

  describe('addIngredient() + findIngredientById() test:', () => {
    it('should add ingreadient item with specyfied quantity (gramms) and find ingredient by passed nameId', () => {
      //when
      backoffice.addIngredient(ingredientName, ingredientQty);

      //then + then
      const expectedFoundIngredient: Ingredient = backoffice.findIngredientById(
        ingredientName.toLocaleUpperCase()
      );

      //...then
      assert.equal(
        expectedFoundIngredient.name,
        ingredientName.toLocaleLowerCase()
      );
      assert.equal(expectedFoundIngredient.qty, ingredientQty);
    });

    it('should throw ValidatorError on try to add ingredient with not valid qty (-)', () => {
      //given
      const newIngredientQty: number = -10;
      //when//then
      assert.throws(() => {
        backoffice.addIngredient(ingredientName, newIngredientQty);
      }, ValidatorError);
    });

    it('should throw error on try to find by not existing nameId', () => {
      //when//then
      assert.throws(() => {
        backoffice.findIngredientById('notExistingId');
      }, IngretientStoreError);
    });
  });

  describe('removeIngredient() test:', () => {
    it('should remove ingridient from store', () => {
      //given
      backoffice.addIngredient(ingredientName, ingredientQty);

      //when
      backoffice.removeIngredient(ingredientName.toLocaleUpperCase());

      //then
      assert.throws(() => {
        backoffice.findIngredientById(ingredientName.toLocaleUpperCase());
      }, IngretientStoreError);
    });

    it('should throw error on try to remove not existing ingredient', () => {
      //when//then
      assert.throws(() => {
        backoffice.removeIngredient('nonExisting');
      }, IngretientStoreError);
    });
  });

  describe('updateIngredient() test:', () => {
    it('should modify qty of existing ingredient by specyfied qty', () => {
      //given
      const addedQty: number = -500;
      backoffice.addIngredient(ingredientName, ingredientQty);
      const expectedFoundIngredient: Ingredient = backoffice.findIngredientById(
        ingredientName.toLocaleUpperCase()
      );

      //when
      backoffice.updateIngredient(ingredientName.toLocaleUpperCase(), addedQty);

      //then
      const expectedUpdatedIngredient: Ingredient =
        backoffice.findIngredientById(ingredientName.toLocaleUpperCase());
      assert.equal(
        expectedUpdatedIngredient.qty,
        expectedFoundIngredient.qty + addedQty
      );
    });

    it('should throw IngretientStoreError on try to decrease qty by number higher than ingredient stock', () => {
      //given
      const notValidAddedQty: number = ingredientQty * -2;
      backoffice.addIngredient(ingredientName, ingredientQty);

      //when//then
      assert.throws(() => {
        backoffice.updateIngredient(
          ingredientName.toLocaleUpperCase(),
          notValidAddedQty
        );
      }, IngretientStoreError);
    });

    it('should throw IngretientStoreError on try to update non existing ingredient', () => {
      //when//then
      assert.throws(() => {
        backoffice.updateIngredient('nonExisting', 1);
      }, IngretientStoreError);
    });
  });
});
