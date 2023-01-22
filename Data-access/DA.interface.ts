export interface IDA<Item, Element, Params> {
  findItemById(id: string): Item;
  addOrUpdateItem(
    element: Element,
    params: Params,
  ): boolean | Item;
  removeExistingItem(element: Element): boolean;
  updateExistingItemParam(
    element: Element,
    params: Params,
  ): Item;
}
