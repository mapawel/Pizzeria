import { OrderItem } from 'Orders/Order/OrderItem.type';
import { IngredientsStore } from './Ingredients/Ingredients.store';
import { PizzaStore } from './Pizzas/Pizza.store';
import { IngredientResDTO } from './Ingredients/DTO/IngredientRes.dto';
import { PizzaResDTO } from './Pizzas/DTO/PizzaRes.dto';
import { PizzaIngredientType } from './Pizzas/Pizza/PizzaIngredients.type';
import { PizzaIngredient } from './Pizzas/Pizza-ingredient/PizzaIngredient';

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

  public addPizza(
    name: string,
    ingredients: PizzaIngredientType[]
  ): PizzaResDTO {
    return this.pizzasStore.addPizza(name, ingredients);
  }

  public removePizza(nameId: string): boolean {
    return this.pizzasStore.removePizza(nameId);
  }

  public updatePizza(
    nameId: string,
    ingredients: PizzaIngredientType[]
  ): PizzaResDTO {
    return this.pizzasStore.updatePizza(nameId, ingredients);
  }

  public cookPizzas(totalIngredientsArr: PizzaIngredient[]): boolean {
    totalIngredientsArr.forEach((ingredient: PizzaIngredient) => {
      this.ingredientsStore.updateIngredient(
        ingredient.nameId,
        -ingredient.qty
      );
    });
    return true;
  }

  public takeIngredientsForOrder(orderItems: OrderItem[]): PizzaIngredient[] {
    const allIngredientsDuplicated: PizzaIngredient[][] = orderItems.map(
      (orderItem: OrderItem) => this.recalculateIngredientsQty(orderItem)
    );
    const ingredientNameIds: string[] = this.getUniqueNameIds(
      allIngredientsDuplicated
    );
    const allIngredients = this.getTotalIngredients(
      ingredientNameIds,
      allIngredientsDuplicated
    );
    allIngredients.forEach((ingredient: PizzaIngredient) => {
      this.ingredientsStore.checkIfEnough(ingredient.nameId, ingredient.qty);
    });
    return allIngredients;
  }

  private recalculateIngredientsQty(orderItem: OrderItem): PizzaIngredient[] {
    const pizzaToCook = this.pizzasStore.findPizzaById(
      orderItem.product.pizza.nameId
    );
    //TODO to change above! Need ID only
    const ingredientsArr = Array.from(pizzaToCook.recipe).map(
      ([_, value]) => value
    );
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
          nameId: acc.nameId,
          qty: acc.qty + x.qty,
        })
      );
    });
  }
}
