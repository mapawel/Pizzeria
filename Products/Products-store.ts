import { DAOinterface } from 'DAO/DAO.interface';
import { PizzaItem } from '../Kitchen/Pizzas/PizzaItem.type';
import { ProductItem } from './ProductItem.type';
import { ProductsStoreError } from './Products-store.exception';

export class ProductsStore
  implements DAOinterface<ProductItem, PizzaItem, number, null>
{
  static instance: ProductsStore | null;
  private readonly products: Map<string, ProductItem> = new Map();

  private constructor() {}

  public static getInstance() {
    if (ProductsStore.instance) return ProductsStore.instance;
    return (ProductsStore.instance = new ProductsStore());
  }

  public static resetInstance() {
    ProductsStore.instance = null;
  }

  public getProductArr(): ProductItem[] {
    return Array.from(this.products, ([_, value]) => value);
  }

  public findItemById(id: string): ProductItem {
    return this.validateIfExisting(id);
  }

  public addOrUpdateItem(pizzaItem: PizzaItem, price: number): ProductItem {
    const productItem: ProductItem = {
      pizzaItem,
      price,
    };
    this.products.set(pizzaItem.pizza.nameId, productItem);
    return productItem;
  }

  public removeExistingItem(pizzaItem: PizzaItem): boolean {
    this.validateIfExisting(pizzaItem.pizza.nameId);
    this.products.delete(pizzaItem.pizza.nameId);
    return true;
  }

  public updateExistingItemParam(pizzaItem: PizzaItem, price: number): boolean {
    this.validateIfExisting(pizzaItem.pizza.nameId);
    this.products.set(pizzaItem.pizza.nameId, {
      pizzaItem,
      price,
    });
    return true;
  }

  private validateIfExisting(id: string): ProductItem {
    const foundWorker = this.products.get(id);
    if (!foundWorker)
      throw new ProductsStoreError(
        'Product with passed id not found in service, could not proceed.',
        { id }
      );
    return foundWorker;
  }
}