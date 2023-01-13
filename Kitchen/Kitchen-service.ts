import { OrderItem } from 'Orders/Order/OrderItem.type';
import { IngredientItem } from './Ingredients/Ingredient-item.type';
import { IngredientsStore } from './Ingredients/Ingredients-store.class';
import { PizzaStore } from './Pizzas/Pizza-store.class';
import { IKitchenService } from './Kitchen-service.interface';

export class KitchenService implements IKitchenService {
  static instance: KitchenService | null;
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

  public cookPizzas(totalIngredientsArr: IngredientItem[]): boolean {
    totalIngredientsArr.forEach((item: IngredientItem) => {
      this.ingredientsStore.updateExistingItemParam(item.ingredient, -item.qty);
    });
    return true;
  }

  public takeIngredientsForOrder(orderItems: OrderItem[]): IngredientItem[] {
    const allIngredientsDuplicated: IngredientItem[][] = orderItems.map(
      (orderItem: OrderItem) => this.recalculateIngredientsQty(orderItem)
    );
    const ingredientNameIds: string[] = this.getUniqueNameIds(
      allIngredientsDuplicated
    );

    const allIngredients = this.getTotalIngredients(
      ingredientNameIds,
      allIngredientsDuplicated
    );
    allIngredients.forEach((item: IngredientItem) => {
      this.ingredientsStore.checkIfEnough(item.ingredient.nameId, item.qty);
    });
    return allIngredients;
  }

  private recalculateIngredientsQty(orderItem: OrderItem): IngredientItem[] {
    const pizzaToCook = this.pizzasStore.findItemById(
      orderItem.product.pizzaItem.pizza.nameId
    );
    const ingredientsArr = Array.from(pizzaToCook.recipe).map(
      ([_, value]) => value
    );
    return ingredientsArr.map((item: IngredientItem) => ({
      ...item,
      qty: item.qty * orderItem.qty,
    }));
  }

  private getUniqueNameIds(
    allIngredientsDuplicated: IngredientItem[][]
  ): string[] {
    return [
      ...new Set(
        allIngredientsDuplicated
          .flat(1)
          .map(
            (ingredientItem: IngredientItem) => ingredientItem.ingredient.nameId
          )
      ),
    ];
  }

  private getTotalIngredients(
    ingredientNameIds: string[],
    allIngredientsDuplicated: IngredientItem[][]
  ): IngredientItem[] {
    return ingredientNameIds.map((ingrNameId: string) => {
      const oneTypeIngredientArr: IngredientItem[] = allIngredientsDuplicated
        .flat(1)
        .filter(
          (ingredientItem: IngredientItem) =>
            ingredientItem.ingredient.nameId === ingrNameId
        );

      return oneTypeIngredientArr.reduce(
        (acc: IngredientItem, x: IngredientItem) => ({
          ingredient: acc.ingredient,
          qty: acc.qty + x.qty,
        })
      );
    });
  }
}
