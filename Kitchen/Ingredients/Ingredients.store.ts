import { StockIngredient } from './Stock-ingredient/Stock-ingredient';
import { IngretientStoreError } from './exceptions/Ingredient-store.exception';
import { IngredientResDTO } from './DTO/Ingredient-res.dto';
import { isPlus } from '../../general-validators/plus.validator';
import { IngredientDTOMapper } from './DTO/Ingredient-dto.mapper';

export class IngredientsStore {
  private static instance: IngredientsStore | null;
  private readonly ingredients: Map<string, StockIngredient> = new Map();

  private constructor() {}

  public static getInstance() {
    if (IngredientsStore.instance) return IngredientsStore.instance;
    return (IngredientsStore.instance = new IngredientsStore());
  }

  public static resetInstance() {
    IngredientsStore.instance = null;
  }

  public findIngredientById(nameId: string): IngredientResDTO {
    const foundIngredient: StockIngredient = this.getIfExistingById(nameId);
    return IngredientDTOMapper.mapToResDTO(foundIngredient);
  }

  public addIngredient(name: string, qty: number): IngredientResDTO {
    isPlus(qty, 'Quantity');

    const ingredient: StockIngredient = new StockIngredient(name, qty);

    this.ingredients.set(ingredient.nameId, ingredient);

    return IngredientDTOMapper.mapToResDTO(ingredient);
  }

  public removeIngredient(nameId: string): boolean {
    const result: boolean = this.ingredients.delete(nameId);
    if (!result) this.throwValidateError(nameId);
    return true;
  }

  public updateIngredient(nameId: string, qty: number): IngredientResDTO {
    const foundIngredient: StockIngredient =
      qty < 0
        ? this.checkIfEnough(nameId, -qty)
        : this.getIfExistingById(nameId);

    const newIngredient: StockIngredient = {
      ...foundIngredient,
      qty: foundIngredient.qty + qty,
    };

    this.ingredients.set(nameId, newIngredient);

    return IngredientDTOMapper.mapToResDTO(newIngredient);
  }

  public checkIfEnough(nameId: string, qty: number): StockIngredient {
    const foundIngredient = this.getIfExistingById(nameId);
    if (foundIngredient.qty < qty) {
      throw new IngretientStoreError(`Not enought ${nameId} on stock.`, {
        nameId,
      });
    }
    return foundIngredient;
  }

  private throwValidateError(nameId: string): void {
    throw new IngretientStoreError(
      'Ingredient with passed nameId not found in store, could not proceed.',
      { nameId }
    );
  }

  private getIfExistingById(nameId: string): StockIngredient {
    const foundIngredient = this.ingredients.get(nameId);
    if (!foundIngredient) this.throwValidateError(nameId);
    return foundIngredient as StockIngredient;
  }
}
