import { OrderItem } from 'Orders/Order/Order-item.type';
import { IngredientItem } from './Ingredients/Ingredient-item.type';
import { IngredientsStore } from './Ingredients/Ingredients.store';
import { PizzaStore } from './Pizzas/Pizza.store';
import { Ingredient } from './Ingredients/Ingredient/Ingredient.class';
import { PizzaItem } from './Pizzas/Pizza-item.type';
import { Pizza } from './Pizzas/Pizza/Pizza.class';

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

  public getAllIngredients(): IngredientItem[] {
    return this.ingredientsStore.getAllIngredientsArr();
  }

  //TODO tu trzeba podać instancję! Czy to jest dobre wejście dla usera?
  public addIngredient(ingredient: Ingredient, qty: number): boolean {
    return this.ingredientsStore.addOrUpdateItem(ingredient, { qty });
  }

  public updateIngredient(ingredient: Ingredient, qty: number): boolean {
    return this.ingredientsStore.updateExistingItemParam(ingredient, { qty });
  }

  public removeIngredient(ingredient: Ingredient): boolean {
    return this.ingredientsStore.removeExistingItem(ingredient);
  }

  public getAllPizzas(): PizzaItem[] {
    return this.pizzasStore.getAllPizzasArr();
  }

  public createAndAddNewPizza(
    name: string,
    ingredientsWhQty: { ingredient: Ingredient; qty: number }[],
    time: number
  ): PizzaItem {
    return this.pizzasStore.createAndAddNewPizza(name, ingredientsWhQty, time);
  }

  public updatePizza(
    pizza: Pizza,
    recipe: Map<string, IngredientItem>,
    time: number
  ): boolean {
    return this.pizzasStore.updateExistingItemParam(pizza, { recipe, time });
  }

  public removePizza(pizza: Pizza): boolean {
    return this.pizzasStore.removeExistingItem(pizza);
  }

  public cookPizzas(totalIngredientsArr: IngredientItem[]): boolean {
    totalIngredientsArr.forEach((item: IngredientItem) => {
      this.ingredientsStore.updateExistingItemParam(item.ingredient, {
        qty: -item.qty,
      });
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
