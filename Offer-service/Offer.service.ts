import { ProductsStore } from '../Products/Products.store';
import { ProductItem } from '../Products/Product-item.type';
import { Pizza } from 'Kitchen/Pizzas/Pizza/Pizza';
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

  public findMenuProduct(nameId: string): ProductItem {
    return this.products.findItemById(nameId);
  }

  public addMenuProduct(
    pizza: Pizza,
    { price }: { price: number }
  ): ProductItem {
    return this.products.addOrUpdateItem(pizza, { price });
  }

  public updateMenuProduct(
    pizzaNameId: string,
    { price }: { price: number }
  ): ProductItem {
    return this.products.updateExistingItemParam(pizzaNameId, { price });
  }

  public removeMenuProduct(pizzaNameId: string): boolean {
    return this.products.removeExistingItem(pizzaNameId);
  }

  public getAllDiscountsArr(): (Discount | DiscountLimited)[] {
    return this.discounts.getAllDiscounts();
  }

  public addOrUpdateDiscount(
    discount: Discount | DiscountLimited
  ): Discount | DiscountLimited {
    return this.discounts.addOrUpdateDiscount(discount);
  }

  public removeDiscountByCode(discountCode: string): boolean {
    return this.discounts.removeDiscountByCode(discountCode);
  }
}
