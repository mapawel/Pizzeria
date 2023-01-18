import { DiscountStore } from '../Discounts/Discount.store';
import { ProductsStore } from '../Products/Products.store';
import { ProductItem } from '../Products/Product-item.type';
import { PizzaItem } from '../Kitchen-service/Pizzas/Pizza-item.type';
import { Discount } from '../Discounts/Discount/Discount.class';

export class OfferService {
  private static instance: OfferService | null;
  private readonly discounts: DiscountStore;
  private readonly products: ProductsStore;

  private constructor() {
    this.discounts = DiscountStore.getInstance();
    this.products = ProductsStore.getInstance();
  }

  public static getInstance() {
    if (OfferService.instance) return OfferService.instance;
    return (OfferService.instance = new OfferService());
  }

  public static resetInstance() {
    OfferService.instance = null;
  }

  public getMenuProducts(): ProductItem[] {
    return this.products.getProductArr();
  }

  public addMenuProduct(
    pizzaItem: PizzaItem,
    { price }: { price: number }
  ): ProductItem {
    return this.products.addOrUpdateItem(pizzaItem, { price });
  }

  public updateMenuProduct(
    pizzaItem: PizzaItem,
    { price }: { price: number }
  ): boolean {
    return this.products.updateExistingItemParam(pizzaItem, { price });
  }

  public removeMenuProduct(pizzaItem: PizzaItem): boolean {
    return this.products.removeExistingItem(pizzaItem);
  }

  public getAllDiscountsArr(): Discount[] {
    return this.discounts.getAllDiscountsArr();
  }

  //TODO tu trzeba podać instancję! Czy to jest dobre wejście dla usera?
  public addDiscount(discount: Discount): boolean {
    return this.discounts.addOrUpdateItem(discount);
  }

  public removeDiscount(discount: Discount): boolean {
    return this.discounts.removeExistingItem(discount);
  }
}
