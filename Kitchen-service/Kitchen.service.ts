import { OrderItem } from 'Orders/Order/Order-item.type';
import { IngredientsStore } from './Ingredients/Ingredients.store';
import { PizzaStore } from './Pizzas/Pizza.store';
import { Ingredient } from './Ingredients/Ingredient/Ingredient.class';
import { PizzaItem } from './Pizzas/Pizza-item.type';
import { IngredientReqDTO } from './Ingredients/DTO/IngredientReqDTO';
import { IngredientResDTO } from './Ingredients/DTO/IngredientResDTO';
import { IngredientIdReqDTO } from './Ingredients/DTO/IngredientIdReqDTO';

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

  public getAllIngredients(): IngredientResDTO[] {
    return this.ingredientsStore.getAllIngredientsArr();
  }

  public addIngredient({ name, qty }: IngredientReqDTO): IngredientResDTO {
    return this.ingredientsStore.addOrUpdateItem({ name, qty });
  }

  public updateIngredient({
    nameId,
    qty,
  }: IngredientIdReqDTO): IngredientResDTO {
    return this.ingredientsStore.updateExistingItemParam({ nameId, qty });
  }

  public removeIngredient(ingredientNameId: string): boolean {
    return this.ingredientsStore.removeExistingItem(ingredientNameId);
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
    pizzaNameId: string,
    { recipe, time }: { recipe: Map<string, Ingredient>; time: number }
  ): PizzaItem {
    return this.pizzasStore.updateExistingItemParam(pizzaNameId, {
      recipe,
      time,
    });
  }

  public removePizza(pizzaNameId: string): boolean {
    return this.pizzasStore.removeExistingItem(pizzaNameId);
  }

  public cookPizzas(totalIngredientsArr: Ingredient[]): boolean {
    totalIngredientsArr.forEach((ingredient: Ingredient) => {
      this.ingredientsStore.updateExistingItemParam({
        nameId: ingredient.nameId,
        qty: -ingredient.qty,
      });
    });
    return true;
  }

  public takeIngredientsForOrder(orderItems: OrderItem[]): IngredientResDTO[] {

    console.log(' orderItems----> ', orderItems);

    const allIngredientsDuplicated: Ingredient[][] = orderItems.map(
      (orderItem: OrderItem) => this.recalculateIngredientsQty(orderItem)
    );

    console.log('allIngredientsDuplicated ----> ', allIngredientsDuplicated);

    const ingredientNameIds: string[] = this.getUniqueNameIds(
      allIngredientsDuplicated
    );


      console.log('ingredientNameIds ----> ', ingredientNameIds);

    const allIngredients = this.getTotalIngredients(
      ingredientNameIds,
      allIngredientsDuplicated
    );

      console.log('!!!!!!!!!!!!!!allIngredients ----> ', allIngredients);

    allIngredients.forEach((ingredient: Ingredient) => {
      this.ingredientsStore.checkIfEnough(ingredient.nameId, ingredient.qty);
    });
    return allIngredients;
  }

  private recalculateIngredientsQty(orderItem: OrderItem): Ingredient[] {
    const pizzaToCook = this.pizzasStore.findItemById(
      orderItem.product.pizzaItem.pizza.nameId
    );
    const ingredientsArr = Array.from(pizzaToCook.recipe).map(
      ([_, value]) => value
    );
    return ingredientsArr.map((ingredient: Ingredient) => ({
      ...ingredient,
      qty: ingredient.qty * orderItem.qty,
    }));
  }

  private getUniqueNameIds(allIngredientsDuplicated: Ingredient[][]): string[] {
    return [
      ...new Set(
        allIngredientsDuplicated
          .flat(1)
          .map((ingredient: Ingredient) => ingredient.nameId)
      ),
    ];
  }

  private getTotalIngredients(
    ingredientNameIds: string[],
    allIngredientsDuplicated: Ingredient[][]
  ): Ingredient[] {
    return ingredientNameIds.map((ingrNameId: string) => {
      const oneTypeIngredientArr: Ingredient[] = allIngredientsDuplicated
        .flat(1)
        .filter((ingredient: Ingredient) => ingredient.nameId === ingrNameId);

      return oneTypeIngredientArr.reduce((acc: Ingredient, x: Ingredient) => ({
        nameId: acc.nameId,
        name: acc.name,
        qty: acc.qty + x.qty,
      }));
    });
  }
}
