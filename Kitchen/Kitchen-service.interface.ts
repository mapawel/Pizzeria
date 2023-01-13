import { IngredientItem } from './Ingredients/Ingredient-item.type';
import { OrderItem } from 'Orders/Order/OrderItem.type';

export interface IKitchenService {
  cookPizzas(totalIngredientsArr: IngredientItem[]): boolean;
  takeIngredientsForOrder(orderItems: OrderItem[]): IngredientItem[];
}
