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

  findItem(nameId: string): IngredientItem {
    return this.validateIfExisting(nameId);
  }

  addOrUpdateItem(ingredient: Ingredient, qty: number): boolean {
    // qty VALIDATOR to ADD here
    this.ingredients.set(ingredient.nameId, {
      ingredient,
      qty,
    });
    return true;
  }

  removeExistingItem(ingredient: Ingredient): boolean {
    this.validateIfExisting(ingredient.nameId);
    this.ingredients.delete(ingredient.nameId);
    return true;
  }

  updateExistingItemParam(ingredient: Ingredient, qty: number): boolean {
    // qty VALIDATOR to ADD here
    const foundIngredient = this.validateIfExisting(ingredient.nameId);
    this.ingredients.set(ingredient.nameId, {
      ingredient: foundIngredient.ingredient,
      qty: foundIngredient.qty + qty,
    });
    return true;
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
