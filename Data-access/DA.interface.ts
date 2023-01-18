export interface IDA<Item, Element, Param1, Param2> {
  findItemById(id: string): Item;
  addOrUpdateItem(
    element: Element,
    param1?: Param1,
    param2?: Param2
  ): boolean | Item;
  removeExistingItem(element: Element): boolean;
  updateExistingItemParam(
    element: Element,
    param1?: Param1,
    param2?: Param2
  ): boolean;
}
