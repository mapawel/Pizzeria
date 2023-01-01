export interface DAOinterface<Item, Element, Param1, Param2> {
  findItemById(id: string): Item;
  addOrUpdateItem(element: Element, param1?: Param1, param2?: Param2): boolean;
  removeExistingItem(element: Element): boolean;
  updateExistingItemParam(
    element: Element,
    param1?: Param1,
    param2?: Param2
  ): boolean;
}
