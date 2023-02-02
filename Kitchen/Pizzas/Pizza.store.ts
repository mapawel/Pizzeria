import { Pizza } from './Pizza/Pizza';
import { PizzaStoreError } from './exceptions/Pizza.store.exception';
import { PizzaIngredient } from './Pizza-ingredient/PizzaIngredient';
import { PizzaResDTO } from './DTO/PizzaRes.dto';
import { isPlus } from '../../general-validators/plus.validator';
import { PizzaIngredientType } from './Pizza/PizzaIngredients.type';

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
      price: foundPizza.price,
    };
  }

  public addPizza(
    name: string,
    ingredients: PizzaIngredientType[],
    price: number
  ): PizzaResDTO {
    const ingredientsMap: Map<string, PizzaIngredient> =
      this.translateIngredientsArrToMap(ingredients);

    const newPizza: Pizza = new Pizza(name, ingredientsMap, price);
    const updatedMap: Map<string, Pizza> = this.pizzas.set(
      newPizza.nameId,
      newPizza
    );
    const addedPizza = updatedMap.get(newPizza.nameId) as PizzaResDTO;

    return {
      nameId: addedPizza.nameId,
      name: addedPizza.name,
      recipe: addedPizza.recipe,
      price: addedPizza.price,
    };
  }

  public removePizza(nameId: string): boolean {
    this.gatIfExisting(nameId);
    this.pizzas.delete(nameId);
    return true;
  }

  public updatePizza(
    nameId: string,
    ingredients: PizzaIngredientType[],
    price: number
  ): PizzaResDTO {
    const foundPizza: Pizza = this.gatIfExisting(nameId);
    const updatedIngredients: Map<string, PizzaIngredient> =
      this.translateIngredientsArrToMap(ingredients);

    const updatedMap: Map<string, Pizza> = this.pizzas.set(foundPizza.nameId, {
      ...foundPizza,
      recipe: updatedIngredients,
      price,
    });

    const updatedPizza: Pizza = updatedMap.get(foundPizza.nameId) as Pizza;

    return {
      nameId: updatedPizza.nameId,
      name: updatedPizza.name,
      recipe: updatedPizza.recipe,
      price: updatedPizza.price,
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
