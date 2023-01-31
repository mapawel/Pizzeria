import { Pizza } from 'Kitchen-service/Pizzas/Pizza/Pizza.class';
import { ProductItem } from './Product-item.type';
import { ProductsStoreError } from './Products.store.exception';

export class ProductsStore {
  private static instance: ProductsStore | null;
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

  public addOrUpdateItem(
    pizza: Pizza,
    { price }: { price: number }
  ): ProductItem {
    const productItem: ProductItem = {
      pizza,
      price,
    };
    this.products.set(pizza.nameId, productItem);
    return productItem;
  }

  public removeExistingItem(pizzaNameId: string): boolean {
    this.validateIfExisting(pizzaNameId);
    this.products.delete(pizzaNameId);
    return true;
  }

  public updateExistingItemParam(
    pizzaNameId: string,
    { price }: { price: number }
  ): ProductItem {
    const productItem: ProductItem = this.validateIfExisting(pizzaNameId);
    const updatedMap = this.products.set(pizzaNameId, {
      pizza: productItem.pizza,
      price,
    });
    return updatedMap.get(pizzaNameId) as ProductItem;
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
