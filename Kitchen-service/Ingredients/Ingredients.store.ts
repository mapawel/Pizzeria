import { Ingredient } from './Ingredient/Ingredient.class';
import { IngredientItem } from './Ingredient-item.type';
import { IDA } from '../../Data-access/DA.interface';
import { IngretientStoreError } from './Ingredient.store.exception';

export class IngredientsStore
  implements IDA<IngredientItem, Ingredient, { qty: number }>
{
  private static instance: IngredientsStore | null;
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

  public addOrUpdateItem(
    ingredient: Ingredient,
    { qty }: { qty: number }
  ): IngredientItem {
    // qty VALIDATOR to ADD here
    const updatedMap = this.ingredients.set(ingredient.nameId, {
      ingredient,
      qty,
    });
    return updatedMap.get(ingredient.nameId) as IngredientItem;
  }

  public removeExistingItem(ingredientNameId: string): boolean {
    this.validateIfExisting(ingredientNameId);
    this.ingredients.delete(ingredientNameId);
    return true;
  }

  public updateExistingItemParam(
    ingredientNameId: string,
    { qty }: { qty: number }
  ): IngredientItem {
    // qty VALIDATOR to ADD here
    const foundIngredient =
      qty < 0
        ? this.checkIfEnough(ingredientNameId, -qty)
        : this.validateIfExisting(ingredientNameId);
    const updatedMap = this.ingredients.set(ingredientNameId, {
      ingredient: foundIngredient.ingredient,
      qty: foundIngredient.qty + qty,
    });
    return updatedMap.get(ingredientNameId) as IngredientItem;
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
