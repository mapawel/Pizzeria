import { StockIngredient } from '../Stock-ingredient/Stock-ingredient';
import { IngredientResDTO } from './Ingredient-res.dto';

export class IngredientDTOMapper {
  public static mapToResDTO(ingredient: StockIngredient): IngredientResDTO {
    return {
      nameId: ingredient.nameId,
      name: ingredient.name,
      qty: ingredient.qty,
    };
  }
}
