import { assert } from 'chai';
import { PizzaStore } from '../Pizza.store';
import { Pizza } from '../Pizza/Pizza.class';
import { recipe, recipe2 } from './recipes';
describe('Pizzas store tests suite:', () => {
  const pizzaName = 'Margerita';
  const pizzaTime = 12;

  let pizzaStore: PizzaStore;
  beforeEach(() => {
    pizzaStore = PizzaStore.getInstance();
  });

  afterEach(() => {
    PizzaStore.resetInstance();
  });

  describe('createAndAddNewPizza() + addOrUpdateItem() + findItemById()', () => {
    it('should create a new Pizza and add it to store', () => {
      pizzaStore.createAndAddNewPizza(pizzaName, recipe, pizzaTime);

      const expectedFoundPizza = pizzaStore.findItemById(
        pizzaName.replace(/\s/g, '').toUpperCase()
      );

      const recipeMap = new Map();
      recipe.forEach(({ ingredient, qty }) =>
        recipeMap.set(ingredient.nameId, {
          ingredient,
          qty,
        })
      );
      assert.equal(expectedFoundPizza.pizza.name, pizzaName);
      assert.deepEqual(expectedFoundPizza.recipe, recipeMap);
      assert.equal(expectedFoundPizza.time, pizzaTime);
    });

    it('should throw error on try to find by not existing nameId', () => {
      assert.throws(() => {
        pizzaStore.findItemById('notExistingId');
      }, 'Pizza with passed nameId not found in store, could not proceed.');
    });
  });

  describe('removeExistingItem() test:', () => {
    it('should remove pizza item from store', () => {
      pizzaStore.createAndAddNewPizza(pizzaName, recipe, pizzaTime);

      const expectedFoundPizza = pizzaStore.findItemById(
        pizzaName.replace(/\s/g, '').toUpperCase()
      );

      pizzaStore.removeExistingItem(expectedFoundPizza.pizza.nameId);

      assert.throws(() => {
        pizzaStore.findItemById(pizzaName.replace(/\s/g, '').toUpperCase());
      }, 'Pizza with passed nameId not found in store, could not proceed.');
    });

    it('should throw error on try to remove not existing pizza', () => {
      assert.throws(() => {
        pizzaStore.removeExistingItem('nonExisting');
      }, 'Pizza with passed nameId not found in store, could not proceed.');
    });
  });

  describe('updateExistingItemParam() test:', () => {
    it('should modify recipe of existing pizza item to a new one', () => {
      pizzaStore.createAndAddNewPizza(pizzaName, recipe, pizzaTime);

      const expectedFoundPizza = pizzaStore.findItemById(
        pizzaName.replace(/\s/g, '').toUpperCase()
      );

      const recipeMap2 = new Map();
      recipe2.forEach(({ ingredient, qty }) =>
        recipeMap2.set(ingredient.nameId, {
          ingredient,
          qty,
        })
      );
      const newPizzaTime = 15;
      pizzaStore.updateExistingItemParam(expectedFoundPizza.pizza.nameId, {
        recipe: recipeMap2,
        time: newPizzaTime,
      });

      const expectedUpdatedPizza = pizzaStore.findItemById(
        pizzaName.replace(/\s/g, '').toUpperCase()
      );

      assert.equal(expectedUpdatedPizza.pizza.name, pizzaName);
      assert.deepEqual(expectedUpdatedPizza.recipe, recipeMap2);
      assert.equal(expectedUpdatedPizza.time, newPizzaTime);
    });
  });
});
