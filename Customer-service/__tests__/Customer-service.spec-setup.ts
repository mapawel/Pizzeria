import { Role } from '../../Workers/Worker/Roles.enum';
import { PizzaIngredientType } from '../../Kitchen/Pizzas/Pizza/Pizza-ingredients.type';
import { BackofficeService } from '../../Backoffice-service/Backoffice.service';
import { WorkerDTO } from '../../Workers/DTO/Worker.dto';
import { TableDTO } from '../../Tables/DTO/Table.dto';
import { PizzaIngredientDTO } from '../../Kitchen/Pizzas/DTO/Pizza-ingredient.dto';

export class CustomerServiceSpecSetup {
  private readonly backoffice: BackofficeService;

  public readonly discountUnlimitedCode: string = 'UnlimitedCode';
  public readonly discountUnlimitedPercent: number = 0.1;
  public readonly discountLimitedCode: string = 'LimitedCode';
  private readonly discountLimitedQty: number = 3;
  public readonly discountLimitedPercent: number = 0.5;

  private readonly workerName: string = 'John Doe';
  private readonly workerRole: Role = Role.COOK;
  private readonly workerIsAvailable: boolean = true;
  private exampleWorkerId: string = '';

  private readonly tableName: string = 'BigRound';
  private readonly tableSits: number = 6;
  public readonly tableSitsAvailable: number = 6;
  private readonly tableIsAvailable = true;
  private exampleTableId: string = '';

  private readonly ingredient1Name: string = 'Sose';
  private readonly ingredient1NameId: string = this.ingredient1Name
    .trim()
    .toUpperCase();
  private ingredient1Qty: number = 1000;

  private readonly ingredient2Name: string = 'Cheese';
  private readonly ingredient2NameId: string = this.ingredient2Name
    .trim()
    .toUpperCase();
  private readonly ingredient2Qty: number = 1000;

  private readonly ingredient3Name: string = 'Salami';
  private readonly ingredient3NameId: string = this.ingredient3Name
    .trim()
    .toUpperCase();
  private readonly ingredient3Qty: number = 1000;

  private readonly pizza1Name: string = 'ExamplePizza1';
  public readonly pizza1Price: number = 30;
  private readonly pizza1Ingredients: PizzaIngredientType[] = [
    {
      stockIngredientNameId: this.ingredient1NameId,
      qtyNeeded: 100,
    },
    {
      stockIngredientNameId: this.ingredient2NameId,
      qtyNeeded: 200,
    },
  ];
  public readonly pizza1NameId: string = this.pizza1Name.trim().toUpperCase();

  private readonly pizza2Name: string = 'ExamplePizza2';
  public readonly pizza2Price: number = 40;
  private readonly pizza2Ingredients: PizzaIngredientType[] = [
    {
      stockIngredientNameId: this.ingredient1NameId,
      qtyNeeded: 150,
    },
    {
      stockIngredientNameId: this.ingredient3NameId,
      qtyNeeded: 50,
    },
  ];
  public readonly pizza2NameId: string = this.pizza2Name.trim().toUpperCase();

  constructor() {
    this.backoffice = BackofficeService.getInstance();

    this.backoffice.addDiscount(
      this.discountUnlimitedCode,
      this.discountUnlimitedPercent
    );
    this.backoffice.addDiscount(
      this.discountLimitedCode,
      this.discountLimitedPercent,
      this.discountLimitedQty
    );

    const addedWorker: WorkerDTO = this.backoffice.addWorker({
      name: this.workerName,
      role: this.workerRole,
      isAvailable: this.workerIsAvailable,
    });
    if (addedWorker.id) this.setExampleWorkerId(addedWorker.id);

    const addedTable: TableDTO = this.backoffice.addTable({
      name: this.tableName,
      sits: this.tableSits,
      sitsAvailable: this.tableSitsAvailable,
      isAvailable: this.tableIsAvailable,
    });
    if (addedTable.id) this.setExampleTableId(addedTable.id);

    this.backoffice.addIngredient(this.ingredient1Name, this.ingredient1Qty);
    this.backoffice.addIngredient(this.ingredient2Name, this.ingredient2Qty);
    this.backoffice.addIngredient(this.ingredient3Name, this.ingredient3Qty);

    this.backoffice.addPizza(
      this.pizza1Name,
      this.pizza1Ingredients,
      this.pizza1Price
    );
    this.backoffice.addPizza(
      this.pizza2Name,
      this.pizza2Ingredients,
      this.pizza2Price
    );
  }

  private ingredientsRequiredFor2MockedPizzas(
    pizza1Qty: number,
    pizza2Qty: number
  ): PizzaIngredientDTO[] {
    return [
      {
        nameId: this.ingredient1NameId,
        qty: 100 * pizza1Qty + 150 * pizza2Qty,
      },
      {
        nameId: this.ingredient2NameId,
        qty: 200 * pizza1Qty,
      },
      {
        nameId: this.ingredient3NameId,
        qty: 50 * pizza2Qty,
      },
    ];
  }

  public ingredientsAfterCooking2MockedPizzas(
    pizza1Qty: number,
    pizza2Qty: number
  ): PizzaIngredientDTO[] {
    const allRequiredIng: PizzaIngredientDTO[] =
      this.ingredientsRequiredFor2MockedPizzas(pizza1Qty, pizza2Qty);

    const ingRegured = (ingredientNameId: string): number =>
      allRequiredIng.find(
        ({ nameId }: { nameId: string }) => nameId === ingredientNameId
      )?.qty as number;

    return [
      {
        nameId: this.ingredient1NameId,
        qty: this.ingredient1Qty - ingRegured(this.ingredient1NameId),
      },
      {
        nameId: this.ingredient2NameId,
        qty: this.ingredient1Qty - ingRegured(this.ingredient2NameId),
      },
      {
        nameId: this.ingredient3NameId,
        qty: this.ingredient1Qty - ingRegured(this.ingredient3NameId),
      },
    ];
  }

  public get ingredientQty1(): PizzaIngredientDTO {
    return this.backoffice.findIngredientById(this.ingredient1NameId);
  }

  public get ingredientQty2(): PizzaIngredientDTO {
    return this.backoffice.findIngredientById(this.ingredient2NameId);
  }

  public get ingredientQty3(): PizzaIngredientDTO {
    return this.backoffice.findIngredientById(this.ingredient3NameId);
  }

  public get workerId(): string {
    return this.exampleWorkerId;
  }

  public get tableId(): string {
    return this.exampleTableId;
  }

  public changeExampleWorkerAvailibility(availability: boolean): void {
    this.backoffice.updateWorker({
      id: this.exampleWorkerId,
      name: this.workerName,
      role: this.workerRole,
      isAvailable: availability,
    });
  }

  public makeIngredientOutOfStock(): void {
    this.backoffice.updateIngredient(
      this.ingredient1NameId,
      -this.ingredient1Qty
    );
  }

  public changeExampleTableAvailibility(availability: boolean): void {
    this.backoffice.updateTable({
      id: this.exampleTableId,
      name: this.tableName,
      sits: this.tableSits,
      sitsAvailable: this.tableSitsAvailable,
      isAvailable: availability,
    });
  }

  private setExampleWorkerId(id: string): void {
    this.exampleWorkerId = id;
  }

  private setExampleTableId(id: string): void {
    this.exampleTableId = id;
  }
}
