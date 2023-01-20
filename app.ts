import { Ingredient } from './Kitchen-service/Ingredients/Ingredient/Ingredient.class';
import { Worker } from './Workers/Worker/Worker.class';
import { Role } from './Workers/Worker/Roles.enum';
import { Table } from './Tables/Table/Table.class';
import { BackofficeService } from './Backoffice-service/Backoffice.service';
import { KitchenService } from './Kitchen-service/Kitchen.service';
import { OfferService } from './Offer-service/Offer.service';
import { CustomerService } from './Customer-service/Customer.service';
import { DiscountStore } from './Discounts/Discount-store/Discount.store';
import { Discount } from './Discounts/Discount/Discount.class';

const kitchen = KitchenService.getInstance();
const backoffice = BackofficeService.getInstance();
const offer = OfferService.getInstance();
const service = CustomerService.getInstance();
const discounts = DiscountStore.getInstance();

const cake = new Ingredient('cake');
const sose = new Ingredient('sose');
const cheese = new Ingredient('cheese');
const salami = new Ingredient('salami');

const d1 = new Discount('qwe', 0.1);
discounts.addOrUpdateDiscount(d1);

kitchen.addIngredient(cake, { qty: 1000 });
kitchen.addIngredient(sose, { qty: 1000 });
kitchen.addIngredient(cheese, { qty: 1000 });
kitchen.addIngredient(salami, { qty: 1000 });

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

const margerittaProduct = offer.addMenuProduct(margeritta, { price: 30 });
const salameProduct = offer.addMenuProduct(salame, { price: 36 });

const cook1 = new Worker('andrzej', Role.cook);
const cook2 = new Worker('janusz', Role.cook);

const table1 = new Table('1', 4);
const table2 = new Table('2', 4);

backoffice.addWorker(cook1, { isAvailable: true });
backoffice.addTable(table1, { sitsToReserve: 0, isAvailable: true });

const order1 = service.orderWhReservation(
  [
    { product: margerittaProduct, qty: 2 },
    { product: salameProduct, qty: 1 },
  ],
  3,
  'qwe'
);

console.log(order1);
