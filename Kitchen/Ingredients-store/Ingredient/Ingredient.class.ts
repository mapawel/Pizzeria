export class Ingredient {
  readonly nameId: string;
  readonly name: string;
  public constructor(name: string) {
    this.nameId = name.replace(/\s/g, '').toUpperCase();
    this.name = name.trim().toLowerCase();
  }
}
