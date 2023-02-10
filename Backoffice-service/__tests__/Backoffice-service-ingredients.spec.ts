import { assert } from 'chai';
import { Ingredient } from 'Kitchen/interfaces/Ingredient.interface';
import { BackofficeService } from '../Backoffice.service';
import { IngretientStoreError } from '../../Kitchen/Ingredients/exceptions/Ingredient-store.exception';

describe('Backoffice service tests suite - ingredients methods:', () => {
  let backoffice: BackofficeService;
  beforeEach(() => {
    backoffice = BackofficeService.getInstance();
  });

  afterEach(() => {
    BackofficeService.resetInstance();
  });

  describe('addIngredient() + findIngredientById() test:', () => {
    const ingredientName = 'Sose';
    const ingredientQty = 1000;

    it('should add ingreadient item with specyfied quantity (gramms) and find ingredient by passed nameId', () => {
      backoffice.addIngredient(ingredientName, ingredientQty);

      const expectedFoundIngredient: Ingredient = backoffice.findIngredientById(
        ingredientName.toLocaleUpperCase()
      );

      assert.equal(
        expectedFoundIngredient.name,
        ingredientName.toLocaleLowerCase()
      );
      assert.equal(expectedFoundIngredient.qty, ingredientQty);
    });

    it('should throw error on try to find by not existing nameId', () => {
      assert.throws(() => {
        backoffice.findIngredientById('notExistingId');
      }, IngretientStoreError);
    });
  });

  describe('removeIngredient() test:', () => {
    it('should remove ingridient from store', () => {
      const ingredientName = 'Sose';
      const ingredientQty = 1000;

      backoffice.addIngredient(ingredientName, ingredientQty);

      const expectedFoundIngredient: Ingredient = backoffice.findIngredientById(
        ingredientName.toLocaleUpperCase()
      );

      assert.equal(
        expectedFoundIngredient.name,
        ingredientName.toLocaleLowerCase()
      );
      assert.equal(expectedFoundIngredient.qty, ingredientQty);

      backoffice.removeIngredient(ingredientName.toLocaleUpperCase());

      assert.throws(() => {
        backoffice.findIngredientById(ingredientName.toLocaleUpperCase());
      }, IngretientStoreError);
    });

    it('should throw error on try to remove not existing ingredient', () => {
      assert.throws(() => {
        backoffice.removeIngredient('nonExisting');
      }, IngretientStoreError);
    });
  });

  describe('updateIngredient() test:', () => {
    it('should modify qty of existing ingredient by specyfied qty', () => {
      const ingredientName = 'Sose';
      const ingredientQty = 1000;
      const addedQty: number = -500;

      backoffice.addIngredient(ingredientName, ingredientQty);

      const expectedFoundIngredient: Ingredient = backoffice.findIngredientById(
        ingredientName.toLocaleUpperCase()
      );

      assert.equal(
        expectedFoundIngredient.name,
        ingredientName.toLocaleLowerCase()
      );
      assert.equal(expectedFoundIngredient.qty, ingredientQty);

      backoffice.updateIngredient(ingredientName.toLocaleUpperCase(), addedQty);

      const expectedUpdatedIngredient: Ingredient =
        backoffice.findIngredientById(ingredientName.toLocaleUpperCase());

      assert.equal(
        expectedUpdatedIngredient.qty,
        expectedFoundIngredient.qty + addedQty
      );
    });
  });
});
