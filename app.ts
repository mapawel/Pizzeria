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
import { DiscountLimited } from './Discounts/Discount/Discount-limited.class';

const kitchen = KitchenService.getInstance();
const backoffice = BackofficeService.getInstance();
const offer = OfferService.getInstance();
const service = CustomerService.getInstance();
const discounts = DiscountStore.getInstance();

const cake = new Ingredient('cake');
const sose = new Ingredient('sose');
const cheese = new Ingredient('cheese');
const salami = new Ingredient('salami');

const d1 = new Discount('qwe', 0.2);
const d2 = new DiscountLimited('asd', 0.1, 2);
discounts.addOrUpdateDiscount(d1);
discounts.addOrUpdateDiscount(d2);

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
  'salame',
  [
    { ingredient: cake, qty: 200 },
    { ingredient: cheese, qty: 100 },
    { ingredient: sose, qty: 50 },
    { ingredient: salami, qty: 75 },
  ],
  10
);

offer.addMenuProduct(margeritta, { price: 30 });
offer.addMenuProduct(salame, { price: 36 });

const cook1 = new Worker('andrzej', Role.cook);
const cook2 = new Worker('janusz', Role.cook);

const table1 = new Table('1', 4);
const table2 = new Table('2', 4);

backoffice.addWorker(cook1, { isAvailable: false });
backoffice.addTable(table1, { sitsToReserve: 0, isAvailable: true });

const order1 = service.orderWhReservation(
  [
    { productNameId: 'MARGERITTA', qty: 1 },
    { productNameId: 'SALAME', qty: 1 },
  ],
  3,
  'asd'
);

backoffice.updateWorker(cook1, { isAvailable: true });


const updated = service.executePendingOrder(order1.id, cook1.id);

console.log(updated);
