// import { Worker } from './Workers/Worker/Worker.class';
// import { Role } from './Workers/Worker/Roles.enum';
// import { Table } from './Tables/Table/Table';
// import { BackofficeService } from './Backoffice-service/Backoffice.service';
// import { KitchenService } from './Kitchen/Kitchen.service';
// import { OfferService } from './Offer-service/Offer.service';
// import { CustomerService } from './Customer-service/Customer.service';
// import { DiscountStore } from './Discounts/Discount-store/Discount.store';
// import { Discount } from './Discounts/Discount/Discount.class';
// import { DiscountLimited } from './Discounts/Discount/Discount-limited.class';
// import { OrdersServiceCollections } from './Orders/Order/Orders-service.collections.enum';

// const kitchen = KitchenService.getInstance();
// const backoffice = BackofficeService.getInstance();
// const offer = OfferService.getInstance();
// const service = CustomerService.getInstance();
// const discounts = DiscountStore.getInstance();

// const d1 = new Discount('qwe', 0.2);
// const d2 = new DiscountLimited('asd', 0.1, 2);
// discounts.addOrUpdateDiscount(d1);
// discounts.addOrUpdateDiscount(d2);

// const cake = kitchen.addIngredient('cake', 1000);
// const sose = kitchen.addIngredient('sose', 1000);
// const cheese = kitchen.addIngredient('cheese', 1000);
// const salami = kitchen.addIngredient('salami', 1000);

// const margeritta = kitchen.addPizza('margeritta', [
//   { stockIngredientNameId: 'CAKE', qtyNeeded: 200 },
//   { stockIngredientNameId: 'CHEESE', qtyNeeded: 200 },
//   { stockIngredientNameId: 'SOSE', qtyNeeded: 50 },
// ]);

// const salame = kitchen.addPizza('salame', [
//   { stockIngredientNameId: 'CAKE', qtyNeeded: 220 },
//   { stockIngredientNameId: 'CHEESE', qtyNeeded: 220 },
//   { stockIngredientNameId: 'SOSE', qtyNeeded: 55 },
//   { stockIngredientNameId: 'SALAMI', qtyNeeded: 100 },
// ]);

// offer.addMenuProduct(margeritta, { price: 30 });
// offer.addMenuProduct(salame, { price: 36 });

// const cook1 = new Worker('andrzej', Role.COOK);
// const cook2 = new Worker('janusz', Role.COOK);

// const table1 = new Table('1', 4);
// const table2 = new Table('2', 4);

// backoffice.addWorker(cook1, { isAvailable: false });
// backoffice.addTable(table1, { sitsToReserve: 0, isAvailable: true });

// const order1 = service.orderWhReservation(
//   [
//     { productNameId: 'MARGERITTA', qty: 1 },
//     { productNameId: 'SALAME', qty: 1 },
//   ],
//   3,
//   'asd'
// );

// backoffice.updateWorker(cook1.id, { isAvailable: true });

// console.log(
//   'AFTER ORDER:',
//   service.listOrders(OrdersServiceCollections.ORDERS_PENDING)
// );
// console.log(
//   'AFTER ORDER:',
//   service.listOrders(OrdersServiceCollections.ORDERS_IN_PROGRESS)
// );
// console.log(
//   'AFTER ORDER:',
//   service.listOrders(OrdersServiceCollections.ORDERS_FINISHED)
// );

// const updated = service.executePendingOrder(order1.id, cook1.id);

// console.log(
//   'AFTER EXECUTE:',
//   service.listOrders(OrdersServiceCollections.ORDERS_PENDING)
// );
// console.log(
//   'AFTER EXECUTE:',
//   service.listOrders(OrdersServiceCollections.ORDERS_IN_PROGRESS)
// );
// console.log(
//   'AFTER EXECUTE:',
//   service.listOrders(OrdersServiceCollections.ORDERS_FINISHED)
// );

// const updated2 = service.finishOrderByCook(order1.id, cook1.id);

// console.log(
//   'AFTER FINISH:',
//   service.listOrders(OrdersServiceCollections.ORDERS_PENDING)
// );
// console.log(
//   'AFTER FINISH:',
//   service.listOrders(OrdersServiceCollections.ORDERS_IN_PROGRESS)
// );
// console.log(
//   'AFTER FINISH:',
//   service.listOrders(OrdersServiceCollections.ORDERS_FINISHED)
// );
