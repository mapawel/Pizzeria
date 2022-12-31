import { assert } from 'chai';
import { IngredientsStore } from '../Ingredients-store.class';
import { ingredient1Mock } from './ingredient1Mock';

describe('Ingredient store tests suite:', () => {
  const qty: number = 10000;
  let ingredientsStore: IngredientsStore;
  beforeEach(() => {
    ingredientsStore = IngredientsStore.getInstance();
  });

  afterEach(() => {
    IngredientsStore.resetInstance();
  });

  describe('addOrUpdateIngredient()  + findIngredient() test:', () => {
    const qty: number = 10000;

    it('should add ingreadient item with specyfied quantity (gramms) and find ingredient by passet nameId', () => {
      ingredientsStore.addOrUpdateIngredient({
        ingredient: ingredient1Mock,
        qty,
      });

      const expectedFoundIngredientItem = ingredientsStore.findIngredient(
        ingredient1Mock.nameId
      );
      assert.deepEqual(expectedFoundIngredientItem.ingredient, ingredient1Mock);
      assert.equal(expectedFoundIngredientItem.qty, qty);
    });

    it('should add ingreadient item with specyfied quantity (gramms), then should update quantity', () => {
      const changedQty: number = qty * 2;
      ingredientsStore.addOrUpdateIngredient({
        ingredient: ingredient1Mock,
        qty,
      });
      ingredientsStore.addOrUpdateIngredient({
        ingredient: ingredient1Mock,
        qty: changedQty,
      });

      const expectedFoundIngredientItem = ingredientsStore.findIngredient(
        ingredient1Mock.nameId
      );
      assert.deepEqual(expectedFoundIngredientItem.ingredient, ingredient1Mock);
      assert.equal(expectedFoundIngredientItem.qty, changedQty);
    });

    it('should throw error on try to find by not existing nameId', () => {
      ingredientsStore.addOrUpdateIngredient({
        ingredient: ingredient1Mock,
        qty,
      });
      assert.throws(() => {
        ingredientsStore.findIngredient('notExistingId');
      }, 'Ingredient with passet nameId not found in store, could not proceed.');
    });
  });

  describe('removeExistingIngredient() test:', () => {
    it('should remove ingridient from store', () => {
      ingredientsStore.addOrUpdateIngredient({
        ingredient: ingredient1Mock,
        qty,
      });

      const expectedFoundIngredientItem = ingredientsStore.findIngredient(
        ingredient1Mock.nameId
      );
      assert.deepEqual(expectedFoundIngredientItem.ingredient, ingredient1Mock);
      assert.equal(expectedFoundIngredientItem.qty, qty);

      ingredientsStore.removeExistingIngredient(
        expectedFoundIngredientItem.ingredient
      );

      assert.throws(() => {
        ingredientsStore.findIngredient(ingredient1Mock.nameId);
      }, 'Ingredient with passet nameId not found in store, could not proceed.');
    });

    it('should throw error on try to remove not existing ingredient', () => {
      assert.throws(() => {
        ingredientsStore.removeExistingIngredient(ingredient1Mock);
      }, 'Ingredient with passet nameId not found in store, could not proceed.');
    });
  });

  describe('updateExistingIngredientQty() test:', () => {
    it('should modify qty of existing ingredient qty by specyfied number', () => {
      const qtyToModify: number = 100;
      ingredientsStore.addOrUpdateIngredient({
        ingredient: ingredient1Mock,
        qty,
      });

      const expectedFoundIngredientItem = ingredientsStore.findIngredient(
        ingredient1Mock.nameId
      );
      assert.deepEqual(expectedFoundIngredientItem.ingredient, ingredient1Mock);
      assert.equal(expectedFoundIngredientItem.qty, qty);

      ingredientsStore.updateExistingIngredientQty({
        ingredient: expectedFoundIngredientItem.ingredient,
        qty: qtyToModify,
      });

      const expectedUpdatedIngredientItem = ingredientsStore.findIngredient(
        ingredient1Mock.nameId
      );
      assert.deepEqual(
        expectedUpdatedIngredientItem.ingredient,
        ingredient1Mock
      );
      assert.equal(expectedUpdatedIngredientItem.qty, qty + qtyToModify);
    });

    it('should throw error on try to remove not existing ingredient', () => {
      assert.throws(() => {
        ingredientsStore.removeExistingIngredient(ingredient1Mock);
      }, 'Ingredient with passet nameId not found in store, could not proceed.');
    });
  });
});
