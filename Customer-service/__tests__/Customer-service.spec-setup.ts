import { Role } from '../../Workers/Worker/Roles.enum';
import { PizzaIngredientType } from '../../Kitchen/Pizzas/Pizza/Pizza-ingredients.type';
import { BackofficeService } from '../../Backoffice-service/Backoffice.service';
import { WorkerDTO } from '../../Workers/DTO/Worker.dto';
import { TableDTO } from 'Tables/DTO/Table.dto';

export class CustomerServiceSpecSetup {
  private readonly backoffice: BackofficeService;

  public readonly discountUnlimitedCode = 'UnlimitedCode';
  private readonly discountUnlimitedPercent = 0.1;
  public readonly discountLimitedCode = 'LimitedCode';
  private readonly discountLimitedQty = 3;
  private readonly discountLimitedPercent = 0.5;

  private readonly workerName = 'John Doe';
  private readonly workerRole: Role = Role.COOK;
  private readonly workerIsAvailable = true;
  private exampleWorkerId: string = '';

  private readonly tableName = 'BigRound';
  private readonly tableSits = 6;
  private readonly tableSitsAvailable = 6;
  private readonly tableIsAvailable = true;
  private exampleTableId: string = '';

  private readonly ingredient1Name = 'Sose';
  private readonly ingredient1NameId = this.ingredient1Name
    .trim()
    .toUpperCase();
  private readonly ingredient1Qty = 1000;

  private readonly ingredient2Name = 'Cheese';
  private readonly ingredient2NameId = this.ingredient2Name
    .trim()
    .toUpperCase();
  private readonly ingredient2Qty = 1000;

  private readonly ingredient3Name = 'Cheese';
  private readonly ingredient3NameId = this.ingredient3Name
    .trim()
    .toUpperCase();
  private readonly ingredient3Qty = 1000;

  private readonly pizza1Name = 'ExamplePizza1';
  public readonly pizza1Price = 30;
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
  public readonly pizza1NameId = this.pizza1Name.trim().toUpperCase();

  private readonly pizza2Name = 'ExamplePizza2';
  public readonly pizza2Price = 40;
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
  public readonly pizza2NameId = this.pizza2Name.trim().toUpperCase();

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

  public workerId(): string {
    return this.exampleWorkerId;
  }

  public changeExampleWorkerAvailibility(availability: boolean): void {
    this.backoffice.updateWorker({
      id: this.exampleWorkerId,
      name: this.workerName,
      role: this.workerRole,
      isAvailable: availability,
    });
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
