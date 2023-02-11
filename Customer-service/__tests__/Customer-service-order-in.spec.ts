import { assert } from 'chai';
import { OrderResDTO } from '../../Orders/DTO/Order-res.dto';
import { CustomerService } from '../Customer.service';
import { OrdersServiceError } from '../../Orders/exceptions/Orders-service.exception';
import { BackofficeService } from '../../Backoffice-service/Backoffice.service';
import { CustomerServiceSpecSetup } from './Customer-service.spec-setup';
import { OrderItem } from '../../Orders/Order/Order-item.type';
import { OrderState } from '../../Orders/Order/orders-state.enum';
import { ValidatorError } from '../../general-validators/Validator.exception';
import { OrdersStoreError } from '../../Orders/exceptions/Orders-store.exception';
import { PizzaStoreError } from '../../Kitchen/Pizzas/exceptions/Pizza-store.exception';
import { IngretientStoreError } from '../../Kitchen/Ingredients/exceptions/Ingredient-store.exception';
import { TableDTO } from 'Tables/DTO/Table.dto';

describe('Customer service tests suite - orderIn() variants:', () => {
  //setup
  let service: CustomerService;
  let backoffice: BackofficeService;
  let setup: CustomerServiceSpecSetup;

  beforeEach(() => {
    service = CustomerService.getInstance();
    backoffice = BackofficeService.getInstance();
    setup = new CustomerServiceSpecSetup();
  });

  afterEach(() => {
    CustomerService.resetInstance();
    BackofficeService.resetInstance();
  });

  describe('happy path test:', () => {
    it('Should create a new order at place. It can be done if there is a table available only, free cook is not required', () => {
      // all necessary backoffice states are set in setup class
      //given
      const personsToOrder: number = 3;
      setup.changeExampleTableAvailibility(true); // a table for 6 persons
      setup.changeExampleWorkerAvailibility(false);
      const orderItems: OrderItem[] = [
        {
          pizzaNameId: setup.pizza1NameId,
          qty: 2,
        },
        {
          pizzaNameId: setup.pizza2NameId,
          qty: 1,
        },
      ];
      const expectedTotalValue: number =
        setup.pizza1Price * orderItems[0].qty +
        setup.pizza2Price * orderItems[1].qty;

      //when
      const addedOrder: OrderResDTO = service.orderIn(
        orderItems,
        personsToOrder
      );

      //then
      assert.deepEqual(addedOrder.orderItems, orderItems);
      assert.equal(addedOrder.totalValue, expectedTotalValue);
      assert.equal(addedOrder.tableId, setup.tableId);
      assert.equal(addedOrder.tablePerson, personsToOrder);
      assert.isNull(addedOrder.cookId);
    });

    it('Should create a new order at place and this order should have state "ordersPending" due to no cook availablility.', () => {
      // all necessary backoffice states are set in setup class
      //given
      const personsToOrder: number = 1;
      setup.changeExampleTableAvailibility(true); // a table for 6 persons
      setup.changeExampleWorkerAvailibility(false);
      const orderItems: OrderItem[] = [
        {
          pizzaNameId: setup.pizza1NameId,
          qty: 1,
        },
      ];

      //when
      const addedOrder: OrderResDTO = service.orderIn(
        orderItems,
        personsToOrder
      );
      if (addedOrder.id) {
        const foundOrder: OrderResDTO = service.findOrderById(
          addedOrder.id,
          OrderState.ORDERS_PENDING
        );
        //then
        assert.deepEqual(foundOrder, addedOrder);
      } else assert.fail('No order found.');
      //then
    });

    it('Should update table status connected with the order to not available and decrease a number od sits available at this table.', () => {
      // all necessary backoffice states are set in setup class
      //given
      const personsToOrder: number = 1;
      setup.changeExampleTableAvailibility(true); // a table for 6 persons
      const orderItems: OrderItem[] = [
        {
          pizzaNameId: setup.pizza1NameId,
          qty: 1,
        },
      ];

      //when
      const addedOrder: OrderResDTO = service.orderIn(
        orderItems,
        personsToOrder
      );
      if (addedOrder.id) {
        const foundOrder: OrderResDTO = service.findOrderById(
          addedOrder.id,
          OrderState.ORDERS_IN_PROGRESS
        );
        //then
        const assertedTable: TableDTO = backoffice.findTableById(
          foundOrder.tableId as string
        );
        assert.isFalse(assertedTable.isAvailable);
        assert.equal(
          assertedTable.sitsAvailable,
          setup.tableSitsAvailable - personsToOrder
        );
      } else assert.fail('No order found.');
    });

    it('Should create a new order at place with a discount.', () => {
      // all necessary backoffice states are set in setup class
      //given
      const personsToOrder: number = 1;
      setup.changeExampleTableAvailibility(true); // a table for 6 persons
      setup.changeExampleWorkerAvailibility(false);

      const orderItems: OrderItem[] = [
        {
          pizzaNameId: setup.pizza1NameId,
          qty: 2,
        },
        {
          pizzaNameId: setup.pizza2NameId,
          qty: 1,
        },
      ];
      const totalValue: number =
        setup.pizza1Price * orderItems[0].qty +
        setup.pizza2Price * orderItems[1].qty;
      const expectedTotalValue: number =
        totalValue * (1 - setup.discountUnlimitedPercent);
      //when
      const addedOrder: OrderResDTO = service.orderIn(
        orderItems,
        personsToOrder,
        setup.discountUnlimitedCode
      );

      //then
      assert.deepEqual(addedOrder.orderItems, orderItems);
      assert.equal(addedOrder.totalValue, expectedTotalValue);
      assert.equal(addedOrder.tableId, setup.tableId);
      assert.equal(addedOrder.tablePerson, personsToOrder);
      assert.isNull(addedOrder.cookId);
    });

    it('Should create a new order at place and this order should have state "ordersInProgress" while a cook is also available', () => {
      // all necessary backoffice states are set in setup class
      //given
      const personsToOrder: number = 1;
      setup.changeExampleTableAvailibility(true); // a table for 6 persons
      setup.changeExampleWorkerAvailibility(true);

      const orderItems: OrderItem[] = [
        {
          pizzaNameId: setup.pizza1NameId,
          qty: 1,
        },
      ];

      //when
      const addedOrder: OrderResDTO = service.orderIn(
        orderItems,
        personsToOrder
      );

      if (addedOrder.id) {
        const foundOrder: OrderResDTO = service.findOrderById(
          addedOrder.id,
          OrderState.ORDERS_IN_PROGRESS
        );
        //then
        assert.deepEqual(foundOrder, addedOrder);
      } else assert.fail('No order found.');
    });

    it('Should decrease ingredient qtys after creating a new order at place while a cook is also available.', () => {
      // all necessary backoffice states are set in setup class
      //given
      const personsToOrder: number = 1;
      setup.changeExampleTableAvailibility(true); // a table for 6 persons
      setup.changeExampleWorkerAvailibility(true);

      const orderItems: OrderItem[] = [
        {
          pizzaNameId: setup.pizza1NameId,
          qty: 2,
        },
        {
          pizzaNameId: setup.pizza2NameId,
          qty: 1,
        },
      ];

      //when
      service.orderIn(orderItems, personsToOrder);

      //then
      const ingredient1FromStore: number = setup.ingredientQty1.qty;
      const ingredient2FromStore: number = setup.ingredientQty2.qty;
      const ingredient3FromStore: number = setup.ingredientQty3.qty;

      const makeExpectedIngredient = (i: number): number =>
        setup.ingredientsAfterCooking2MockedPizzas(
          orderItems[0].qty,
          orderItems[1].qty
        )[i].qty;

      assert.equal(ingredient1FromStore, makeExpectedIngredient(0));
      assert.equal(ingredient2FromStore, makeExpectedIngredient(1));
      assert.equal(ingredient3FromStore, makeExpectedIngredient(2));
    });
  });

  describe('unsuccessed path test:', () => {
    it('Should throw OrdersServiceError on try to orderIn while there is no table available even there is a free cook', () => {
      // all necessary backoffice states are set in setup class
      //given
      const personsToOrder: number = 1;
      setup.changeExampleWorkerAvailibility(true);
      setup.changeExampleTableAvailibility(false);
      const orderItems: OrderItem[] = [
        {
          pizzaNameId: setup.pizza1NameId,
          qty: 1,
        },
      ];
      //when
      //then
      assert.throws(() => {
        service.orderIn(orderItems, personsToOrder);
      }, OrdersServiceError);
    });

    it('Should throw OrdersServiceError on try to orderIn while there is more persons than free sits at a table', () => {
      // all necessary backoffice states are set in setup class
      //given
      const personsToOrder: number = 6 + 1;
      setup.changeExampleTableAvailibility(true); // a 6 person table
      const orderItems: OrderItem[] = [
        {
          pizzaNameId: setup.pizza1NameId,
          qty: 1,
        },
      ];
      //when
      //then

      assert.throws(() => {
        service.orderIn(orderItems, personsToOrder);
      }, OrdersServiceError);
    });

    it('Should throw OrdersStoreError on try to orderIn not existing product', () => {
      // all necessary backoffice states are set in setup class
      //given
      const personsToOrder: number = 1;
      const orderItems: OrderItem[] = [
        {
          pizzaNameId: 'nonExisting',
          qty: 1,
        },
      ];
      //when
      //then
      assert.throws(() => {
        service.orderIn(orderItems, personsToOrder);
      }, PizzaStoreError);
    });

    it('Should throw ValidatorError on try to orderIn wrong product qty (-)', () => {
      // all necessary backoffice states are set in setup class
      //given
      const personsToOrder: number = 1;
      const orderItems: OrderItem[] = [
        {
          pizzaNameId: setup.pizza1NameId,
          qty: 0,
        },
      ];
      //when
      //then
      assert.throws(() => {
        service.orderIn(orderItems, personsToOrder);
      }, ValidatorError);
    });

    it('Should throw IngredientsStoreError on try to orderIn a product while ther is a cook available to prepare order but ingredient stock to prepare it', () => {
      // all necessary backoffice states are set in setup class
      //given
      const personsToOrder: number = 1;
      setup.changeExampleWorkerAvailibility(true);
      setup.makeIngredientOutOfStock();
      const orderItems: OrderItem[] = [
        {
          pizzaNameId: setup.pizza1NameId,
          qty: 1,
        },
      ];
      //when
      //then
      assert.throws(() => {
        service.orderIn(orderItems, personsToOrder);
      }, IngretientStoreError);
    });
  });
});
