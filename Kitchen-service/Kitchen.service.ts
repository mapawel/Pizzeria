import { OrderItem } from 'Orders/Order/Order-item.type';
import { IngredientsStore } from './Ingredients/Ingredients.store';
import { PizzaStore } from './Pizzas/Pizza.store';
import { Ingredient } from './Ingredients/Ingredient/Ingredient.class';
import { IngredientReqDTO } from './Ingredients/DTO/IngredientReqDTO';
import { IngredientResDTO } from './Ingredients/DTO/IngredientResDTO';
import { IngredientIdReqDTO } from './Ingredients/DTO/IngredientIdReqDTO';
import { CreatePizzaReqDTO } from './DTO/CreatePizzaReqDTO';
import { Pizza } from './Pizzas/Pizza/Pizza.class';

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

  public findIngredientById(nameId: string): IngredientResDTO {
    return this.ingredientsStore.findItemById(nameId);
  }

  public addIngredient({ name, qty }: IngredientReqDTO): IngredientResDTO {
    return this.ingredientsStore.addItem({ name, qty });
  }

  public updateIngredient({
    nameId,
    qty,
  }: IngredientIdReqDTO): IngredientResDTO {
    return this.ingredientsStore.updateItem({ nameId, qty });
  }

  public removeIngredient(ingredientNameId: string): boolean {
    return this.ingredientsStore.removeItem(ingredientNameId);
  }

  public getAllPizzas(): Pizza[] {
    return this.pizzasStore.getAllPizzasArr();
  }

  public createAndAddNewPizza({
    name,
    ingredientIds,
  }: CreatePizzaReqDTO): PizzaResDTO {
    // qty VALIDATOR to ADD here
    const ingredients = ingredientIds.map((nameId: string) =>
      this.findIngredientById(nameId)
    );
    const ingredientsMap = new Map();
    ingredients.forEach((ingredient) =>
      ingredientsMap.set(ingredient.nameId, ingredient)
    );
    const newPizza = new Pizza(name, ingredientsMap);
    this.pizzasStore.addItem({name, ingredientsWhQty: })
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
