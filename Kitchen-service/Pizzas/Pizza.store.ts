import { IDA } from '../../Data-access/DA.interface';
import { Pizza } from './Pizza/Pizza.class';
import { PizzaStoreError } from './Pizza.store.exception';
import { Ingredient } from '../Ingredients/Ingredient/Ingredient.class';
import { PizzaReqDTO } from './DTO/PizzaReqDTO';
import { PizzaResDTO } from './DTO/PizzaResDTO';

export class PizzaStore {
  // implements
  //   IDA<
  //     PizzaItem,
  //     Pizza,
  //     { recipe: Map<string, Ingredient>; time: number }
  //   >
  private static instance: PizzaStore | null;
  private readonly pizzas: Map<string, Pizza> = new Map();

  private constructor() {}

  public static getInstance() {
    if (PizzaStore.instance) return PizzaStore.instance;
    return (PizzaStore.instance = new PizzaStore());
  }

  public static resetInstance() {
    PizzaStore.instance = null;
  }

  public getAllPizzasArr(): PizzaResDTO[] {
    return Array.from(this.pizzas, ([_, value]) => value);
  }

  public findItemById(nameId: string): PizzaResDTO {
    return this.validateIfExisting(nameId);
  }

  public addItem({ name, ingredients }: PizzaReqDTO): PizzaResDTO {
    // qty VALIDATOR to ADD here
    
    const newPizza = new Pizza(name, ingredientsMap);
    const updatedMap: Map<string, Pizza> = this.pizzas.set(
      newPizza.nameId,
      newPizza
    );
    return updatedMap.get(newPizza.nameId) as PizzaResDTO;
  }

  public removeItem(pizzaNameId: string): boolean {
    this.validateIfExisting(pizzaNameId);
    this.pizzas.delete(pizzaNameId);
    return true;
  }

  public updateItem(
    pizzaNameId: string,
    { recipe, time }: { recipe: Map<string, Ingredient>; time: number }
  ): PizzaItem {
    const foundPizza = this.validateIfExisting(pizzaNameId);
    const updatedMap = this.pizzas.set(pizzaNameId, {
      pizza: foundPizza.pizza,
      recipe,
      time,
    });
    return updatedMap.get(pizzaNameId) as PizzaItem;
  }

  private validateIfExisting(nameId: string): PizzaItem {
    const foundPizza = this.pizzas.get(nameId);
    if (!foundPizza)
      throw new PizzaStoreError(
        'Pizza with passed nameId not found in store, could not proceed.',
        { nameId }
      );
    return foundPizza;
  }
}
