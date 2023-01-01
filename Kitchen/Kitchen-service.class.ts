import { IngredientItem } from './Ingredients-store/Ingredient-item.type';
import { IngredientsStore } from './Ingredients-store/Ingredients-store.class';
import { PizzaStore } from './Pizzas-store/Pizza-store.class';

export class KitchenService {
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

  public prepareIngredients(
    pizzaNameId: string,
    pizzasQty: number
  ): IngredientItem[] {
    const pizzaToCook = this.pizzasStore.findItemById(pizzaNameId);
    const ingredientsArr = Array.from(pizzaToCook.recipe).map(
      ([_, value]) => value
    );
    const totalIngredientsArr: IngredientItem[] = ingredientsArr.map(
      (item: IngredientItem) => ({
        ...item,
        qty: item.qty * pizzasQty,
      })
    );
    totalIngredientsArr.forEach((item: IngredientItem) => {
      this.ingredientsStore.checkIfEnough(item.ingredient.nameId, item.qty);
    });
    return totalIngredientsArr;
  }
}
