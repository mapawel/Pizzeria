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

  public cookPizzas(nameId: string, pizzasQty: number): boolean {
    const pizzaToCook = this.pizzasStore.findItem(nameId);
    const ingredientsArr = Array.from(pizzaToCook.recipe).map(
      ([_, value]) => value
    );
    const totalIngredientsArr = ingredientsArr.map((item: IngredientItem) => ({
      ...item,
      qty: item.qty * pizzasQty,
    }));
    totalIngredientsArr.forEach((item: IngredientItem) => {
      this.ingredientsStore.updateExistingItemParam(item.ingredient, -item.qty);
    });
    return true;
  }
}
