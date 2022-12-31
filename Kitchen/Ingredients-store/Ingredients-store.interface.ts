import { IngredientItem } from './Ingredient-item.type';
import { Ingredient } from './Ingredient/Ingredient.class';

export interface IIngredientsStore {
  findIngredient(nameId: string): IngredientItem;
  addOrUpdateIngredient({ ingredient, qty }: IngredientItem): boolean;
  addToExistingStock({ ingredient, qty }: IngredientItem): boolean;
  removeExistingIngredient(ingredient: Ingredient): boolean;
  useIgredient({ ingredient, qty }: IngredientItem): boolean;
}
