import { Ingredient } from './Ingredient/Ingredient.class';
import { IngredientItem } from './Ingredient-item.type';
import { DAOinterface } from '../../DAO/DAO.interface';
import { IngretientStoreError } from './Ingredient-store.exception';

export class IngredientsStore
  implements DAOinterface<IngredientItem, Ingredient, number, null>
{
  static instance: IngredientsStore | null;
  private readonly ingredients: Map<string, IngredientItem> = new Map();

  private constructor() {}

  public static getInstance() {
    if (IngredientsStore.instance) return IngredientsStore.instance;
    return (IngredientsStore.instance = new IngredientsStore());
  }

  public static resetInstance() {
    IngredientsStore.instance = null;
  }

  public getAllIngredientsArr(): IngredientItem[] {
    return Array.from(this.ingredients, ([_, value]) => value);
  }

  public findItemById(nameId: string): IngredientItem {
    return this.validateIfExisting(nameId);
  }

  public addOrUpdateItem(ingredient: Ingredient, qty: number): boolean {
    // qty VALIDATOR to ADD here
    this.ingredients.set(ingredient.nameId, {
      ingredient,
      qty,
    });
    return true;
  }

  public removeExistingItem(ingredient: Ingredient): boolean {
    this.validateIfExisting(ingredient.nameId);
    this.ingredients.delete(ingredient.nameId);
    return true;
  }

  public updateExistingItemParam(ingredient: Ingredient, qty: number): boolean {
    // qty VALIDATOR to ADD here
    const foundIngredient =
      qty < 0
        ? this.checkIfEnough(ingredient.nameId, -qty)
        : this.validateIfExisting(ingredient.nameId);
    this.ingredients.set(ingredient.nameId, {
      ingredient: foundIngredient.ingredient,
      qty: foundIngredient.qty + qty,
    });
    return true;
  }

  public checkIfEnough(nameId: string, qty: number) {
    const foundIngredient = this.validateIfExisting(nameId);
    if (foundIngredient.qty < qty) {
      throw new Error(`Not enought ${nameId} on stock.`);
    }
    return foundIngredient;
  }

  private validateIfExisting(nameId: string): IngredientItem {
    const foundIngredient = this.ingredients.get(nameId);
    if (!foundIngredient)
      throw new IngretientStoreError(
        'Ingredient with passet nameId not found in store, could not proceed.',
        { nameId }
      );
    return foundIngredient;
  }
}
