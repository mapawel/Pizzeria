import { OrderItem } from 'Orders/Order/Order-item.type';
import { IngredientsStore } from './Ingredients/Ingredients.store';
import { PizzaStore } from './Pizzas/Pizza.store';
import { IngredientResDTO } from './Ingredients/DTO/Ingredient-res.dto';
import { PizzaResDTO } from './Pizzas/DTO/Pizza-res.dto';
import { PizzaIngredientType } from './Pizzas/Pizza/Pizza-ingredients.type';
import { PizzaIngredient } from './Pizzas/Pizza-ingredient/Pizza-ingredient';
import { PizzaIngredientDTO } from './Pizzas/DTO/Pizza-ingredient.dto';

export class KitchenService {
  private static instance: KitchenService | null;
  private readonly ingredientsStore: IngredientsStore;
  private readonly pizzasStore: PizzaStore;

  private constructor() {
    this.ingredientsStore = IngredientsStore.getInstance();
    this.pizzasStore = PizzaStore.getInstance();
  }

  public static getInstance() {
    if (KitchenService.instance) return KitchenService.instance;
    return (KitchenService.instance = new KitchenService());
  }

  public static resetInstance() {
    KitchenService.instance = null;
  }

  public findIngredientById(nameId: string): IngredientResDTO {
    return this.ingredientsStore.findIngredientById(nameId);
  }

  public addIngredient(name: string, qty: number): IngredientResDTO {
    return this.ingredientsStore.addIngredient(name, qty);
  }

  public removeIngredient(nameId: string): boolean {
    return this.ingredientsStore.removeIngredient(nameId);
  }

  public updateIngredient(nameId: string, qty: number): IngredientResDTO {
    return this.ingredientsStore.updateIngredient(nameId, qty);
  }

  public findPizzaById(id: string): PizzaResDTO {
    return this.pizzasStore.findPizzaById(id);
  }

  public addPizza(
    name: string,
    ingredients: PizzaIngredientType[],
    price: number
  ): PizzaResDTO {
    return this.pizzasStore.addPizza(name, ingredients, price);
  }

  public removePizza(nameId: string): boolean {
    return this.pizzasStore.removePizza(nameId);
  }

  public updatePizza(
    nameId: string,
    ingredients: PizzaIngredientType[],
    price: number
  ): PizzaResDTO {
    return this.pizzasStore.updatePizza(nameId, ingredients, price);
  }

  public cookPizzas(totalIngredientsArr: PizzaIngredientDTO[]): boolean {
    totalIngredientsArr.forEach((ingredient: PizzaIngredientDTO) => {
      this.ingredientsStore.updateIngredient(
        ingredient.nameId,
        -ingredient.qty
      );
    });
    return true;
  }

  public takeIngredientsForOrder(
    orderItems: OrderItem[]
  ): PizzaIngredientDTO[] {
    const allIngredientsDuplicated: PizzaIngredient[][] = orderItems.map(
      (orderItem: OrderItem) => this.recalculateIngredientsQty(orderItem)
    );
    const ingredientNameIds: string[] = this.getUniqueNameIds(
      allIngredientsDuplicated
    );
    const allIngredients: PizzaIngredient[] = this.getTotalIngredients(
      ingredientNameIds,
      allIngredientsDuplicated
    );
    return allIngredients.map(({ nameId, qty }: PizzaIngredient) => {
      this.ingredientsStore.checkIfEnough(nameId, qty);
      return {
        nameId,
        qty,
      };
    });
  }

  private recalculateIngredientsQty(orderItem: OrderItem): PizzaIngredient[] {
    const pizzaToCook: PizzaResDTO = this.pizzasStore.findPizzaById(
      orderItem.pizzaNameId
    );
    const ingredientsArr: PizzaIngredient[] = Array.from(
      pizzaToCook.recipe
    ).map(([_, value]) => value);
    return ingredientsArr.map((ingredient: PizzaIngredient) => ({
      ...ingredient,
      qty: ingredient.qty * orderItem.qty,
    }));
  }

  private getUniqueNameIds(
    allIngredientsDuplicated: PizzaIngredient[][]
  ): string[] {
    return [
      ...new Set(
        allIngredientsDuplicated
          .flat(1)
          .map((ingredient: PizzaIngredient) => ingredient.nameId)
      ),
    ];
  }

  private getTotalIngredients(
    ingredientNameIds: string[],
    allIngredientsDuplicated: PizzaIngredient[][]
  ): PizzaIngredient[] {
    return ingredientNameIds.map((ingrNameId: string) => {
      const oneTypeIngredientArr: PizzaIngredient[] = allIngredientsDuplicated
        .flat(1)
        .filter(
          (ingredient: PizzaIngredient) => ingredient.nameId === ingrNameId
        );

      return oneTypeIngredientArr.reduce(
        (acc: PizzaIngredient, x: PizzaIngredient) => ({
          id: acc.id,
          nameId: acc.nameId,
          qty: acc.qty + x.qty,
        })
      );
    });
  }
}
