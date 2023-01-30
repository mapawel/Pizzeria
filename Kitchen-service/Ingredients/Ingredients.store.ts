import { Ingredient } from './Ingredient/Ingredient.class';
import { IDA } from '../../Data-access/DA.interface';
import { IngretientStoreError } from './Ingredient.store.exception';
import { IngredientReqDTO } from './DTO/IngredientReqDTO';
import { IngredientResDTO } from './DTO/IngredientResDTO';
import { IngredientIdReqDTO } from './DTO/IngredientIdReqDTO';

export class IngredientsStore {
  // implements IDA<IngredientItem, Ingredient, { qty: number }>
  private static instance: IngredientsStore | null;
  private readonly ingredients: Map<string, Ingredient> = new Map();

  private constructor() {}

  public static getInstance() {
    if (IngredientsStore.instance) return IngredientsStore.instance;
    return (IngredientsStore.instance = new IngredientsStore());
  }

  public static resetInstance() {
    IngredientsStore.instance = null;
  }

  public getAllIngredientsArr(): IngredientResDTO[] {
    return Array.from(this.ingredients, ([_, value]) => value);
  }

  public findItemById(nameId: string): IngredientResDTO {
    return this.validateIfExistingById(nameId);
  }

  public addItem({ name, qty }: IngredientReqDTO): IngredientResDTO {
    // qty VALIDATOR to ADD here
    const ingredient: Ingredient = new Ingredient(name, qty);
    const updatedMap: Map<string, Ingredient> = this.ingredients.set(
      ingredient.nameId,
      ingredient
    );
    return updatedMap.get(ingredient.nameId) as IngredientResDTO;
    // czy zwracanie tu ResDTO czy Ingredient? Właściwie to jest to samo?
  }

  public removeItem(ingredientNameId: string): boolean {
    this.validateIfExistingById(ingredientNameId);
    this.ingredients.delete(ingredientNameId);
    return true;
  }

  public updateItem({ nameId, qty }: IngredientIdReqDTO): IngredientResDTO {
    // qty VALIDATOR to ADD here
    const foundIngredient =
      qty < 0
        ? this.checkIfEnough(nameId, -qty)
        : this.validateIfExistingById(nameId);
    const updatedMap = this.ingredients.set(nameId, {
      nameId: foundIngredient.nameId,
      name: foundIngredient.name,
      qty: foundIngredient.qty + qty,
    });
    return updatedMap.get(nameId) as IngredientResDTO;
  }

  public checkIfEnough(nameId: string, qty: number): Ingredient {
    // tu wyrzucam Ingredient bo wykorzystuję to wewnętrznie w tym scope ale to metoda publiczna i można się do niej dostać z zewnątrz - czy powinno wyć wyrzucane DTO? A co jeśli DTO jest tożsame z Ingedient?
    const foundIngredient = this.validateIfExistingById(nameId);
    if (foundIngredient.qty < qty) {
      throw new Error(`Not enought ${nameId} on stock.`);
    }
    return foundIngredient;
  }

  private validateIfExistingById(nameId: string): Ingredient {
    const foundIngredient = this.ingredients.get(nameId);
    if (!foundIngredient)
      throw new IngretientStoreError(
        'Ingredient with passet nameId not found in store, could not proceed.',
        { nameId }
      );
    return foundIngredient;
  }
}
