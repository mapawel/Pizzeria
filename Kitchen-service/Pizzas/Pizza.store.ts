import { Pizza } from './Pizza/Pizza.class';
import { PizzaStoreError } from './Pizza.store.exception';
import { PizzaIngredient } from './Pizza-ingredient/Pizza-ingredient.class';
import { PizzaResDTO } from './DTO/Pizza-res.DTO';
import { isPlus } from '../../general-validators/plus.validator';
import { PizzaIngredientType } from './Pizza/Pizza-ingredients.type';

export class PizzaStore {
  private static instance: PizzaStore | null;
  private readonly pizzas: Map<string, Pizza> = new Map();

  private constructor() {}

  public static getInstance() {
    if (PizzaStore.instance) return PizzaStore.instance;
    return (PizzaStore.instance = new PizzaStore());
  }

  public static resetInstance() {
    PizzaStore.instance = null;
  }

  public findPizzaById(nameId: string): PizzaResDTO {
    const foundPizza: Pizza = this.gatIfExisting(nameId);
    return {
      nameId: foundPizza.nameId,
      name: foundPizza.name,
      recipe: foundPizza.recipe,
    };
  }

  public addPizza(
    name: string,
    ingredients: PizzaIngredientType[]
  ): PizzaResDTO {
    const ingredientsMap: Map<string, PizzaIngredient> =
      this.translateIngredientsArrToMap(ingredients);

    const newPizza: Pizza = new Pizza(name, ingredientsMap);
    const updatedMap: Map<string, Pizza> = this.pizzas.set(
      newPizza.nameId,
      newPizza
    );
    const addedPizza = updatedMap.get(newPizza.nameId) as PizzaResDTO;

    return {
      nameId: addedPizza.nameId,
      name: addedPizza.name,
      recipe: addedPizza.recipe,
    };
  }

  public removePizza(nameId: string): boolean {
    this.gatIfExisting(nameId);
    this.pizzas.delete(nameId);
    return true;
  }

  public updatePizza(
    nameId: string,
    ingredients: PizzaIngredientType[]
  ): PizzaResDTO {
    const foundPizza: Pizza = this.gatIfExisting(nameId);
    const updatedIngredients: Map<string, PizzaIngredient> =
      this.translateIngredientsArrToMap(ingredients);

    const updatedMap: Map<string, Pizza> = this.pizzas.set(foundPizza.nameId, {
      ...foundPizza,
      recipe: updatedIngredients,
    });

    const updatedPizza: Pizza = updatedMap.get(foundPizza.nameId) as Pizza;

    return {
      nameId: updatedPizza.nameId,
      name: updatedPizza.name,
      recipe: updatedPizza.recipe,
    };
  }

  private gatIfExisting(nameId: string): Pizza {
    const foundPizza = this.pizzas.get(nameId);
    if (!foundPizza)
      throw new PizzaStoreError(
        'Pizza with passed nameId not found in store, could not proceed.',
        { nameId }
      );
    return foundPizza;
  }

  private translateIngredientsArrToMap(
    ingredients: PizzaIngredientType[]
  ): Map<string, PizzaIngredient> {
    ingredients.forEach(({ qtyNeeded }: PizzaIngredientType) =>
      isPlus(qtyNeeded, 'Ingredient quantity')
    );

    return new Map(
      ingredients.map(
        ({
          stockIngredientNameId,
          qtyNeeded,
        }: {
          stockIngredientNameId: string;
          qtyNeeded: number;
        }) => [
          stockIngredientNameId,
          { nameId: stockIngredientNameId, qty: qtyNeeded },
        ]
      )
    );
  }
}
