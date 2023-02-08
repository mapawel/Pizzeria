import { Pizza } from './Pizza/Pizza';
import { PizzaStoreError } from './exceptions/Pizza-store.exception';
import { PizzaIngredient } from './Pizza/Pizza-ingredient';
import { PizzaResDTO } from './DTO/Pizza-res.dto';
import { isPlus } from '../../general-validators/plus.validator';
import { PizzaIngredientType } from './Pizza/Pizza-ingredients.type';
import { PizzaDTOMapper } from './DTO/Pizza-dto.mapper';

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
    const foundPizza: Pizza = this.getIfExisting(nameId);
    return PizzaDTOMapper.mapToResDTO(foundPizza);
  }

  public addPizza(
    name: string,
    ingredients: PizzaIngredientType[],
    price: number
  ): PizzaResDTO {
    const ingredientsMap: Map<string, PizzaIngredient> =
      this.translateIngredientsArrToMap(ingredients);

    const newPizza: Pizza = new Pizza(name, ingredientsMap, price);
    this.pizzas.set(newPizza.nameId, newPizza);

    return PizzaDTOMapper.mapToResDTO(newPizza);
  }

  public removePizza(nameId: string): boolean {
    const result: boolean = this.pizzas.delete(nameId);
    if (!result) this.throwValidateError(nameId);
    return true;
  }

  public updatePizza(
    nameId: string,
    ingredients: PizzaIngredientType[],
    price: number
  ): PizzaResDTO {
    const foundPizza: Pizza = this.getIfExisting(nameId);
    const updatedIngredients: Map<string, PizzaIngredient> =
      this.translateIngredientsArrToMap(ingredients);

    const newPizza: Pizza = {
      ...foundPizza,
      recipe: updatedIngredients,
      price,
    };

    this.pizzas.set(foundPizza.nameId, newPizza);

    return PizzaDTOMapper.mapToResDTO(newPizza);
  }

  private throwValidateError(nameId: string): void {
    throw new PizzaStoreError(
      'Pizza with passed nameId not found in store, could not proceed.',
      { nameId }
    );
  }

  private getIfExisting(nameId: string): Pizza {
    const foundPizza = this.pizzas.get(nameId);
    if (!foundPizza) this.throwValidateError(nameId);
    return foundPizza as Pizza;
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
          new PizzaIngredient(stockIngredientNameId, qtyNeeded),
        ]
      )
    );
  }
}
