import { Pizza } from '../Pizza/Pizza';
import { PizzaResDTO } from './Pizza-res.dto';

export class PizzaDTOMapper {
  public static mapToResDTO(pizza: Pizza): PizzaResDTO {
    return {
      nameId: pizza.nameId,
      name: pizza.name,
      recipe: pizza.recipe,
      price: pizza.price,
    };
  }
}
