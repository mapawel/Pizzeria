export interface IDA<Item, Element, Params> {
  findItemById(id: string): Item;
  addOrUpdateItem(
    element: Element,
    params: Params,
  ): boolean | Item;
  removeExistingItem(id: string): boolean;
  updateExistingItemParam(
    id: string,
    params: Params,
  ): Item;
}
