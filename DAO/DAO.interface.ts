export interface DAOinterface<Item, Element, Parameter, OptionalParam> {
  findItem(id: string): Item;
  addOrUpdateItem(
    element: Element,
    param: Parameter,
    optionalParam?: OptionalParam
  ): boolean;
  removeExistingItem(element: Element): boolean;
  updateExistingItemParam(
    element: Element,
    param: Parameter,
    optionalParam?: OptionalParam
  ): boolean;
}
