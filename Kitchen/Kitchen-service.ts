import { OrderItem } from 'Service/Order/OrderItem.type';
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

  public takeIngredientsForOrder(orderItems: OrderItem[]) {
    const allIngredientsDuplicated: IngredientItem[][] = orderItems.map(
      (orderItem: OrderItem) => this.composeOnePizzaTypeIngredients(orderItem)
    );
    const ingredients: string[] = [
      ...new Set(
        allIngredientsDuplicated
          .flat(1)
          .map(
            (ingredientItem: IngredientItem) => ingredientItem.ingredient.nameId
          )
      ),
    ];
    const allIngredients = ingredients.map((ingrNameId: string) => {
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
    console.log(allIngredients);
  }

  public composeOnePizzaTypeIngredients(
    orderItem: OrderItem
  ): IngredientItem[] {
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
}
