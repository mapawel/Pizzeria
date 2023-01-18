import { Ingredient } from './Kitchen-service/Ingredients/Ingredient/Ingredient.class';
import { Worker } from './Workers/Worker/Worker.class';
import { Role } from './Workers/Worker/Roles.enum';
import { Table } from './Tables/Table/Table.class';
import { BackofficeService } from './Backoffice-service/Backoffice.service';
import { KitchenService } from './Kitchen-service/Kitchen.service';
import { OfferService } from './Offer-service/Offer.service';
import { CustomerService } from './Customer-service/Customer.service';

const kitchen = KitchenService.getInstance();
const backoffice = BackofficeService.getInstance();
const offer = OfferService.getInstance();
const service = CustomerService.getInstance();

const cake = new Ingredient('cake');
const sose = new Ingredient('sose');
const cheese = new Ingredient('cheese');
const salami = new Ingredient('salami');
const onion = new Ingredient('onion');

kitchen.addIngredient(cake, 1000);
kitchen.addIngredient(sose, 1000);
kitchen.addIngredient(cheese, 1000);
kitchen.addIngredient(salami, 1000);

const margeritta = kitchen.createAndAddNewPizza(
  'margeritta',
  [
    { ingredient: cake, qty: 200 },
    { ingredient: cheese, qty: 100 },
    { ingredient: sose, qty: 50 },
  ],
  10
);

const salame = kitchen.createAndAddNewPizza(
  'margeritta',
  [
    { ingredient: cake, qty: 200 },
    { ingredient: cheese, qty: 100 },
    { ingredient: sose, qty: 50 },
    { ingredient: salami, qty: 75 },
  ],
  10
);

const margerittaProduct = offer.addMenuProduct(margeritta, 30);
const salameProduct = offer.addMenuProduct(salame, 36);

const cook1 = new Worker('andrzej', Role.cook);
const cook2 = new Worker('janusz', Role.cook);

const table1 = new Table('1', 4);
const table2 = new Table('2', 4);

backoffice.addWorker(cook1, true);
backoffice.addTable(table1, 0, true);

const order1 = service.orderWhReservation(
  [
    { product: margerittaProduct, qty: 2 },
    { product: salameProduct, qty: 1 },
  ],
  3
);

console.log(order1);
