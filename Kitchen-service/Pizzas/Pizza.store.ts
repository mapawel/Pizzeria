import { IngredientItem } from 'Kitchen-service/Ingredients/Ingredient-item.type';
import { IDA } from '../../Data-access/DA.interface';
import { Pizza } from './Pizza/Pizza.class';
import { PizzaItem } from './Pizza-item.type';
import { PizzaStoreError } from './Pizza.store.exception';
import { Ingredient } from '../Ingredients/Ingredient/Ingredient.class';

export class PizzaStore
  implements
    IDA<
      PizzaItem,
      Pizza,
      { recipe: Map<string, IngredientItem>; time: number }
    >
{
  private static instance: PizzaStore | null;
  private readonly pizzas: Map<string, PizzaItem> = new Map();

  private constructor() {}

  public static getInstance() {
    if (PizzaStore.instance) return PizzaStore.instance;
    return (PizzaStore.instance = new PizzaStore());
  }

  public static resetInstance() {
    PizzaStore.instance = null;
  }

  public getAllPizzasArr(): PizzaItem[] {
    return Array.from(this.pizzas, ([_, value]) => value);
  }

  public findItemById(nameId: string): PizzaItem {
    return this.validateIfExisting(nameId);
  }

  public createAndAddNewPizza(
    name: string,
    ingredientsWhQty: { ingredient: Ingredient; qty: number }[],
    time: number
  ): PizzaItem {
    // qty VALIDATOR to ADD here
    const newPizza = new Pizza(name);
    const ingredientsMap = new Map();
    ingredientsWhQty.forEach(({ ingredient, qty }) =>
      ingredientsMap.set(ingredient.nameId, {
        ingredient,
        qty,
      })
    );
    return this.addOrUpdateItem(newPizza, { recipe: ingredientsMap, time });
  }

  public addOrUpdateItem(
    pizza: Pizza,
    { recipe, time }: { recipe: Map<string, IngredientItem>; time: number }
  ): PizzaItem {
    // qty VALIDATOR to ADD here
    const pizzaItem: PizzaItem = {
      pizza,
      recipe,
      time,
    };
    this.pizzas.set(pizza.nameId, pizzaItem);
    return pizzaItem;
  }

  public removeExistingItem(pizza: Pizza): boolean {
    this.validateIfExisting(pizza.nameId);
    this.pizzas.delete(pizza.nameId);
    return true;
  }

  public updateExistingItemParam(
    pizza: Pizza,
    { recipe, time }: { recipe: Map<string, IngredientItem>; time: number }
  ): boolean {
    const foundPizza = this.validateIfExisting(pizza.nameId);
    this.pizzas.set(pizza.nameId, {
      pizza: foundPizza.pizza,
      recipe,
      time,
    });
    return true;
  }

  private validateIfExisting(nameId: string): PizzaItem {
    const foundPizza = this.pizzas.get(nameId);
    if (!foundPizza)
      throw new PizzaStoreError(
        'Pizza with passed nameId not found in store, could not proceed.',
        { nameId }
      );
    return foundPizza;
  }
}
