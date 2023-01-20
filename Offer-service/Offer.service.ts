import { ProductsStore } from '../Products/Products.store';
import { ProductItem } from '../Products/Product-item.type';
import { PizzaItem } from '../Kitchen-service/Pizzas/Pizza-item.type';
import { Discount } from '../Discounts/Discount/Discount.class';
import { DiscountService } from '../Discounts/Discount-service/Discount.service';
import { DiscountLimited } from '../Discounts/Discount/Discount-limited.class';

export class OfferService {
  private static instance: OfferService | null;
  private readonly discounts: DiscountService;
  private readonly products: ProductsStore;

  private constructor() {
    this.discounts = DiscountService.getInstance();
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

  public getAllDiscountsArr(): (Discount | DiscountLimited)[] {
    return this.discounts.getAllDiscounts();
  }

  //TODO tu trzeba podać instancję! Czy to jest dobre wejście dla usera?
  public addOrUpdateDiscount(discount: Discount | DiscountLimited): boolean {
    return this.discounts.addOrUpdateDiscount(discount);
  }

  public removeDiscountByCode(code: string): boolean {
    return this.discounts.removeDiscountByCode(code);
  }
}
