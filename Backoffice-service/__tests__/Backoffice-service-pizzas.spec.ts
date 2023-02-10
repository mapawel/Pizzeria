import { assert } from 'chai';
import { Ingredient } from 'Kitchen/interfaces/Ingredient.interface';
import { BackofficeService } from '../Backoffice.service';
import { PizzaStoreError } from '../../Kitchen/Pizzas/exceptions/Pizza-store.exception';
import { PizzaIngredientType } from '../../Kitchen/Pizzas/Pizza/Pizza-ingredients.type';
import { PizzaResDTO } from '../../Kitchen/Pizzas/DTO/Pizza-res.dto';
import { PizzaIngredient } from '../../Kitchen/Pizzas/Pizza/Pizza-ingredient';
import { ValidatorError } from '../../general-validators/Validator.exception';

describe('Backoffice service tests suite - pizzas methods:', () => {
  //setup
  let backoffice: BackofficeService;

  const pizzaName = 'ExamplePizza';
  const pizzaPrice = 30;
  const pizzaIngredients: PizzaIngredientType[] = [
    {
      stockIngredientNameId: 'SOSE',
      qtyNeeded: 100,
    },
    {
      stockIngredientNameId: 'CHEESE',
      qtyNeeded: 200,
    },
  ];

  const expectedRecipe: Ingredient[] = pizzaIngredients.map(
    ({
      stockIngredientNameId,
      qtyNeeded,
    }: {
      stockIngredientNameId: string;
      qtyNeeded: number;
    }) => ({
      nameId: stockIngredientNameId,
      qty: qtyNeeded,
    })
  );

  const createTestableRecipe = (map: Map<string, PizzaIngredient>) =>
    Array.from(map, ([_, v]: [string, Ingredient]) => v).map(
      ({ nameId, qty }: Ingredient) => ({ nameId, qty })
    );

  beforeEach(() => {
    backoffice = BackofficeService.getInstance();
  });

  afterEach(() => {
    BackofficeService.resetInstance();
  });

  describe('addPizza() + findPizzaById() test:', () => {
    it('should add pizza with specyfied ingredients and find pizza by passed nameId', () => {
      //when
      backoffice.addPizza(pizzaName, pizzaIngredients, pizzaPrice);

      const assertedPizza: PizzaResDTO = backoffice.findPizzaById(
        pizzaName.toUpperCase()
      );

      //then
      const testableAssertedRecipe = createTestableRecipe(assertedPizza.recipe);

      assert.deepEqual(testableAssertedRecipe, expectedRecipe);
      assert.equal(assertedPizza.name, pizzaName);
      assert.equal(assertedPizza.nameId, pizzaName.toLocaleUpperCase());
      assert.equal(assertedPizza.price, pizzaPrice);
    });

    it('should throw ValidatorError on try to add a new Pizza with not proper ingredient qty (-)', () => {
      const newPizzaIngredients: PizzaIngredientType[] = [
        {
          stockIngredientNameId: 'SOSE',
          qtyNeeded: -100,
        },
        {
          stockIngredientNameId: 'CHEESE',
          qtyNeeded: 200,
        },
      ];
      assert.throws(() => {
        backoffice.addPizza(pizzaName, newPizzaIngredients, pizzaPrice);
      }, ValidatorError);
    });

    it('should throw PizzaStoreError on try to find not existing pizza', () => {
      //when//then
      assert.throws(
        () => backoffice.findPizzaById('nonExisting'),
        PizzaStoreError
      );
    });
  });

  describe('removePizza() test:', () => {
    it('should remove pizza by nameId', () => {
      //given
      backoffice.addPizza(pizzaName, pizzaIngredients, pizzaPrice);
      backoffice.findPizzaById(pizzaName.toUpperCase());
      //when
      backoffice.removePizza(pizzaName.toUpperCase());
      //then

      assert.throws(
        () => backoffice.findPizzaById(pizzaName.toUpperCase()),
        PizzaStoreError
      );
    });

    it('should throw PizzaStoreError on try to remove not existing pizza', () => {
      //when//then
      assert.throws(
        () => backoffice.removePizza('nonExisting'),
        PizzaStoreError
      );
    });
  });

  describe('updatePizza() test:', () => {
    it('should update pizza by nameId with new params', () => {
      //given
      const newPizzaPrice = 40;
      const newPizzaIngredients: PizzaIngredientType[] = [
        {
          stockIngredientNameId: 'SOSE',
          qtyNeeded: 50,
        },
        {
          stockIngredientNameId: 'NEWCHEESE',
          qtyNeeded: 100,
        },
      ];

      const expectedNewRecipe: Ingredient[] = newPizzaIngredients.map(
        ({
          stockIngredientNameId,
          qtyNeeded,
        }: {
          stockIngredientNameId: string;
          qtyNeeded: number;
        }) => ({
          nameId: stockIngredientNameId,
          qty: qtyNeeded,
        })
      );

      backoffice.addPizza(pizzaName, pizzaIngredients, pizzaPrice);

      //when
      backoffice.updatePizza(
        pizzaName.toUpperCase(),
        newPizzaIngredients,
        newPizzaPrice
      );

      //then
      const assertedPizza: PizzaResDTO = backoffice.findPizzaById(
        pizzaName.toUpperCase()
      );

      const testableAssertedRecipe = createTestableRecipe(assertedPizza.recipe);

      assert.deepEqual(testableAssertedRecipe, expectedNewRecipe);
      assert.equal(assertedPizza.price, newPizzaPrice);
    });

    it('should throw ValidatorError on try to update a Pizza with not proper ingredient qty (-)', () => {
      const newPizzaIngredients: PizzaIngredientType[] = [
        {
          stockIngredientNameId: 'SOSE',
          qtyNeeded: -100,
        },
        {
          stockIngredientNameId: 'CHEESE',
          qtyNeeded: 200,
        },
      ];
      assert.throws(() => {
        backoffice.updatePizza(
          pizzaName.toUpperCase(),
          newPizzaIngredients,
          pizzaPrice
        );
      }, ValidatorError);
    });

    it('should throw PizzaStoreError on try to update not existing pizza', () => {
      //when//then
      assert.throws(
        () =>
          backoffice.updatePizza('nonExisting', pizzaIngredients, pizzaPrice),
        PizzaStoreError
      );
    });
  });
});
