import { StockIngredient } from './Stock-ingredient/StockIngredient';
import { IngretientStoreError } from './exceptions/Ingredient.store.exception';
import { IngredientResDTO } from './DTO/IngredientRes.dto';
import { isPlus } from '../../general-validators/plus.validator';

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
    return {
      nameId: foundIngredient.nameId,
      name: foundIngredient.name,
      qty: foundIngredient.qty,
    };
  }

  public addIngredient(name: string, qty: number): IngredientResDTO {
    isPlus(qty, 'Quantity');

    const ingredient: StockIngredient = new StockIngredient(name, qty);

    const updatedMap: Map<string, StockIngredient> = this.ingredients.set(
      ingredient.nameId,
      ingredient
    );

    const addedIngredient: StockIngredient = updatedMap.get(
      ingredient.nameId
    ) as StockIngredient;

    return {
      nameId: addedIngredient.nameId,
      name: addedIngredient.name,
      qty: addedIngredient.qty,
    };
  }

  public removeIngredient(nameId: string): boolean {
    this.getIfExistingById(nameId);
    this.ingredients.delete(nameId);
    return true;
  }

  public updateIngredient(nameId: string, qty: number): IngredientResDTO {
    const foundIngredient: StockIngredient =
      qty < 0
        ? this.checkIfEnough(nameId, -qty)
        : this.getIfExistingById(nameId);

    const updatedMap: Map<string, StockIngredient> = this.ingredients.set(
      nameId,
      {
        ...foundIngredient,
        qty: foundIngredient.qty + qty,
      }
    );

    const updatedItem: StockIngredient = updatedMap.get(
      foundIngredient.nameId
    ) as StockIngredient;

    return {
      nameId: updatedItem.nameId,
      name: updatedItem.name,
      qty: updatedItem.qty,
    };
  }

  public checkIfEnough(nameId: string, qty: number): StockIngredient {
    // tu wyrzucam Ingredient bo wykorzystuję to wewnętrznie w tym scope ale to metoda publiczna i można się do niej dostać z zewnątrz - czy powinno wyć wyrzucane DTO? A co jeśli DTO jest tożsame z Ingedient?
    // TODO to fix!
    const foundIngredient = this.getIfExistingById(nameId);
    if (foundIngredient.qty < qty) {
      throw new Error(`Not enought ${nameId} on stock.`);
    }
    return foundIngredient;
  }

  private getIfExistingById(nameId: string): StockIngredient {
    const foundIngredient = this.ingredients.get(nameId);
    if (!foundIngredient)
      throw new IngretientStoreError(
        'Ingredient with passet nameId not found in store, could not proceed.',
        { nameId }
      );
    return foundIngredient;
  }
}
