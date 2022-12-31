import { IngredientItem } from 'Kitchen/Ingredients-store/Ingredient-item.type';
import { DAOinterface } from '../../DAO/DAO.interface';
import { Pizza } from './Pizza/Pizza';
import { PizzaItem } from './PizzaItem.type';
import { PizzaStoreError } from './Pizza-store.exception';
import { Ingredient } from 'Kitchen/Ingredients-store/Ingredient/Ingredient.class';

export class PizzaStore
  implements DAOinterface<PizzaItem, Pizza, Map<string, IngredientItem>>
{
  static instance: PizzaStore | null;
  private readonly pizzas: Map<string, PizzaItem> = new Map();

  private constructor() {}

  public static getInstance() {
    if (PizzaStore.instance) return PizzaStore.instance;
    return (PizzaStore.instance = new PizzaStore());
  }

  public static resetInstance() {
    PizzaStore.instance = null;
  }
  findItem(nameId: string): PizzaItem {
    return this.validateIfExisting(nameId);
  }

  createAndAddNewPizza(
    name: string,
    ingredientsWhQty: { ingredient: Ingredient; qty: number }[]
  ): boolean {
    // qty VALIDATOR to ADD here
    const newPizza = new Pizza(name);
    const ingredientsMap = new Map();
    ingredientsWhQty.forEach(({ ingredient, qty }) =>
      ingredientsMap.set(ingredient.nameId, {
        ingredient,
        qty,
      })
    );
    this.addOrUpdateItem(newPizza, ingredientsMap);
    return true;
  }

  test(){
    return new Map(this.pizzas)
  }

  addOrUpdateItem(pizza: Pizza, recipe: Map<string, IngredientItem>): boolean {
    // qty VALIDATOR to ADD here
    this.pizzas.set(pizza.nameId, {
      pizza,
      recipe,
    });
    return true;
  }

  removeExistingItem(pizza: Pizza): boolean {
    this.validateIfExisting(pizza.nameId);
    this.pizzas.delete(pizza.nameId);
    return true;
  }

  updateExistingItemParam(
    pizza: Pizza,
    recipe: Map<string, IngredientItem>
  ): boolean {
    const foundPizza = this.validateIfExisting(pizza.nameId);
    this.pizzas.set(pizza.nameId, {
      pizza: foundPizza.pizza,
      recipe,
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
