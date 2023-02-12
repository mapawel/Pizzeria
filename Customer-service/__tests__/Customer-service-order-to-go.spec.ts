import { assert } from 'chai';
import { OrderResDTO } from '../../Orders/DTO/Order-res.dto';
import { CustomerService } from '../Customer.service';
import { OrdersServiceError } from '../../Orders/exceptions/Orders-service.exception';
import { BackofficeService } from '../../Backoffice-service/Backoffice.service';
import { CustomerServiceSpecSetup } from './Customer-service.spec-setup';
import { OrderItem } from '../../Orders/Order/Order-item.type';
import { OrderState } from '../../Orders/Order/orders-state.enum';
import { ValidatorError } from '../../general-validators/Validator.exception';
import { PizzaStoreError } from '../../Kitchen/Pizzas/exceptions/Pizza-store.exception';
import { IngretientStoreError } from '../../Kitchen/Ingredients/exceptions/Ingredient-store.exception';

describe('Customer service tests suite - orderToGo() variants:', () => {
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
    it('Should create a new order to go. It can be done if there is a cook available,free table is not required.', () => {
      // given: all necessary backoffice states are set in setup class

      //given
      setup.changeExampleTableAvailibility(false);
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
      const addedOrder: OrderResDTO = service.orderToGo(orderItems);

      //then
      assert.deepEqual(addedOrder.orderItems, orderItems);
      assert.equal(addedOrder.totalValue, expectedTotalValue);
      assert.isNull(addedOrder.tableId);
    });

    it('Should create a new order to go and this order should have state "ordersInProgress"', () => {
      // given: all necessary backoffice states are set in setup class

      //given
      const orderItems: OrderItem[] = [
        {
          pizzaNameId: setup.pizza1NameId,
          qty: 1,
        },
      ];

      //when
      const addedOrder: OrderResDTO = service.orderToGo(orderItems);

      if (addedOrder.id) {
        //then
        const foundOrder: OrderResDTO = service.findOrderById(
          addedOrder.id,
          OrderState.ORDERS_IN_PROGRESS
        );
        assert.deepEqual(foundOrder, addedOrder);
      } else assert.fail('No order found.');
      //then
    });

    it('Should create a new order to go with a discount.', () => {
      // given: all necessary backoffice states are set in setup class

      //given
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
      const addedOrder: OrderResDTO = service.orderToGo(
        orderItems,
        setup.discountUnlimitedCode
      );

      //then
      assert.deepEqual(addedOrder.orderItems, orderItems);
      assert.equal(addedOrder.totalValue, expectedTotalValue);
      assert.isNull(addedOrder.tableId);
    });

    it('Should decrease ingredient qtys after creating a new order.', () => {
      // given: all necessary backoffice states are set in setup class

      //given
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
      service.orderToGo(orderItems);

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
    it('Should throw OrdersServiceError on try to orderToGo while there is no cook available even there is a free table', () => {
      // given: all necessary backoffice states are set in setup class

      //given
      setup.changeExampleWorkerAvailibility(false);
      setup.changeExampleTableAvailibility(true);
      const orderItems: OrderItem[] = [
        {
          pizzaNameId: setup.pizza1NameId,
          qty: 1,
        },
      ];

      //when//then
      assert.throws(() => {
        service.orderToGo(orderItems);
      }, OrdersServiceError);
    });

    it('Should throw OrdersStoreError on try to orderToGo not existing product', () => {
      // given: all necessary backoffice states are set in setup class

      //given
      setup.changeExampleWorkerAvailibility(true);
      const orderItems: OrderItem[] = [
        {
          pizzaNameId: 'nonExisting',
          qty: 1,
        },
      ];

      //when//then
      assert.throws(() => {
        service.orderToGo(orderItems);
      }, PizzaStoreError);
    });

    it('Should throw ValidatorError on try to orderToGo wrong product qty (-)', () => {
      // given: all necessary backoffice states are set in setup class

      //given
      setup.changeExampleWorkerAvailibility(true);
      const orderItems: OrderItem[] = [
        {
          pizzaNameId: setup.pizza1NameId,
          qty: 0,
        },
      ];

      //when//then
      assert.throws(() => {
        service.orderToGo(orderItems);
      }, ValidatorError);
    });

    it('Should throw IngredientsStoreError on try to orderToGo a product while there is no ingredient stock to prepare it', () => {
      // given: all necessary backoffice states are set in setup class

      //given
      setup.makeIngredientOutOfStock();
      const orderItems: OrderItem[] = [
        {
          pizzaNameId: setup.pizza1NameId,
          qty: 1,
        },
      ];

      //when//then
      assert.throws(() => {
        service.orderToGo(orderItems);
      }, IngretientStoreError);
    });
  });
});
