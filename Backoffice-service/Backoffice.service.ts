import { WorkersStore } from '../Workers/Workers.store';
import { TablesService } from '../Tables/Tables.service';
import { OrderState } from '../Orders/Order/orders-state.enum';
import { KitchenService } from '../Kitchen/Kitchen.service';
import { OrdersService } from '../Orders/Orders.service';
import { OrderResDTO } from '../Orders/DTO/Order-res.dto';
import { WorkerDTO } from '../Workers/DTO/Worker.dto';
import { TableDTO } from '../Tables/DTO/Table.dto';
import { DiscountService } from '../Discounts/Discount.service';
import { IngredientResDTO } from '../Kitchen/Ingredients/DTO/Ingredient-res.dto';
import { PizzaResDTO } from '../Kitchen/Pizzas/DTO/Pizza-res.dto';
import { PizzaIngredientType } from '../Kitchen/Pizzas/Pizza/Pizza-ingredients.type';
import { DiscountResDTO } from '../Discounts/DTO/Discount-res.dto';

export class BackofficeService {
  private static instance: BackofficeService | null;
  private readonly kitchen: KitchenService;
  private readonly orders: OrdersService;
  private readonly discounts: DiscountService;
  private readonly tables: TablesService;
  private readonly workers: WorkersStore;

  private constructor() {
    this.kitchen = KitchenService.getInstance();
    this.discounts = DiscountService.getInstance();
    this.tables = TablesService.getInstance();
    this.workers = WorkersStore.getInstance();
    this.orders = OrdersService.getInstance();
  }

  public static getInstance() {
    if (BackofficeService.instance) return BackofficeService.instance;
    return (BackofficeService.instance = new BackofficeService());
  }

  public static resetInstance() {
    BackofficeService.instance = null;
    KitchenService.resetInstance();
    OrdersService.resetInstance();
    DiscountService.resetInstance();
    TablesService.resetInstance();
    WorkersStore.resetInstance();
  }

  public findIngredientById(nameId: string): IngredientResDTO {
    return this.kitchen.findIngredientById(nameId);
  }

  public addIngredient(name: string, qty: number): IngredientResDTO {
    return this.kitchen.addIngredient(name, qty);
  }

  public removeIngredient(nameId: string): boolean {
    return this.kitchen.removeIngredient(nameId);
  }
  public updateIngredient(nameId: string, qty: number): IngredientResDTO {
    return this.kitchen.updateIngredient(nameId, qty);
  }

  public findPizzaById(id: string): PizzaResDTO {
    return this.kitchen.findPizzaById(id);
  }

  public addPizza(
    name: string,
    ingredients: PizzaIngredientType[],
    price: number
  ): PizzaResDTO {
    return this.kitchen.addPizza(name, ingredients, price);
  }

  public removePizza(nameId: string): boolean {
    return this.kitchen.removePizza(nameId);
  }

  public updatePizza(
    nameId: string,
    ingredients: PizzaIngredientType[],
    price: number
  ): PizzaResDTO {
    return this.kitchen.updatePizza(nameId, ingredients, price);
  }

  public findDiscountByCode(code: string): DiscountResDTO {
    return this.discounts.findDiscountByCode(code);
  }

  public addDiscount(
    code: string,
    discountPercent: number,
    limitQty?: number
  ): DiscountResDTO {
    return this.discounts.addDiscount(code, discountPercent, limitQty);
  }

  public removeDiscount(code: string): boolean {
    return this.discounts.removeDiscount(code);
  }

  public updateDiscount(
    code: string,
    discountPercent: number,
    limitQty?: number
  ): DiscountResDTO {
    return this.discounts.updateDiscount(code, discountPercent, limitQty);
  }

  public findWorker(id: string): WorkerDTO {
    return this.workers.findWorker(id);
  }

  public addWorker({ name, role, isAvailable }: WorkerDTO): WorkerDTO {
    return this.workers.addWorker({ name, role, isAvailable });
  }

  public removeWorker(id: string): boolean {
    return this.workers.removeWorker(id);
  }
  public updateWorker({ id, name, role, isAvailable }: WorkerDTO): WorkerDTO {
    return this.workers.updateWorker({ id, name, role, isAvailable });
  }

  public findTableById(id: string): TableDTO {
    return this.tables.findTableById(id);
  }

  public addTable({
    name,
    sits,
    sitsAvailable,
    isAvailable,
  }: TableDTO): TableDTO {
    return this.tables.addTable({
      name,
      sits,
      sitsAvailable,
      isAvailable,
    });
  }

  public removeTable(id: string): boolean {
    return this.tables.removeTable(id);
  }

  public updateTable({
    id,
    name,
    sits,
    sitsAvailable,
    isAvailable,
  }: TableDTO): TableDTO {
    return this.tables.updateTable({
      id,
      name,
      sits,
      sitsAvailable,
      isAvailable,
    });
  }

  public listOrders(ordersType: OrderState): OrderResDTO[] {
    return this.orders.listOrders(ordersType);
  }

  public findOrderById(id: string, orderType: OrderState): OrderResDTO {
    return this.orders.findOrderById(id, orderType);
  }
}
