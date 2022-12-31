export interface DAOinterface<Item, Element, Parameter> {
  findItem(id: string): Item;
  addOrUpdateItem(element: Element, param: Parameter): boolean;
  removeExistingItem(element: Element): boolean;
  updateExistingItemParam(element: Element, param: Parameter): boolean;
}
