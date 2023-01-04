import { DAOinterface } from 'DAO/DAO.interface';
import { PizzaItem } from '../Kitchen/Pizzas-store/PizzaItem.type';
import { ProductItem } from './ProductItem.type';
import { ProductsServiceError } from './Products-service.exception';

export class ProductsService
  implements DAOinterface<ProductItem, PizzaItem, number, null>
{
  static instance: ProductsService | null;
  private readonly products: Map<string, ProductItem> = new Map();

  private constructor() {}

  public static getInstance() {
    if (ProductsService.instance) return ProductsService.instance;
    return (ProductsService.instance = new ProductsService());
  }

  public static resetInstance() {
    ProductsService.instance = null;
  }
  //TODO to remove
  test() {
    return new Map(this.products);
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
      throw new ProductsServiceError(
        'Product with passed id not found in service, could not proceed.',
        { id }
      );
    return foundWorker;
  }
}
