import chai from 'chai';
import chaiExclude from 'chai-exclude';
import { assert } from 'chai';
import { CustomerService } from '../Customer.service';
import { BackofficeService } from '../../Backoffice-service/Backoffice.service';
import { CustomerServiceSpecSetup } from './Customer-service.spec-setup';
import { OrderItem } from '../../Orders/Order/Order-item.type';
import { OrderState } from '../../Orders/Order/orders-state.enum';
import { OrdersStoreError } from '../../Orders/exceptions/Orders-store.exception';
import { IngretientStoreError } from '../../Kitchen/Ingredients/exceptions/Ingredient-store.exception';
import { OrderResDTO } from '../../Orders/DTO/Order-res.dto';
import { WorkerDTO } from '../../Workers/DTO/Worker.dto';
import { WorkersStoreError } from '../../Workers/exceptions/Workers-store.exception';

chai.use(chaiExclude);

describe('Customer service tests suite - executePendingOrder() variants:', () => {
  //setup
  let service: CustomerService;
  let backoffice: BackofficeService;
  let setup: CustomerServiceSpecSetup;
  let addedOrderId: string = '';

  beforeEach(() => {
    service = CustomerService.getInstance();
    backoffice = BackofficeService.getInstance();
    setup = new CustomerServiceSpecSetup();

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

    const addedOrder: OrderResDTO = service.orderIn(orderItems, personsToOrder);
    addedOrderId = addedOrder.id;
  });

  afterEach(() => {
    CustomerService.resetInstance();
    BackofficeService.resetInstance();
  });

  describe('happy path test:', () => {
    it('Should move the order from "ordersPending" to "ordersInProgress" with cookId attached to order.', () => {
      // all necessary backoffice states are set in setup class

      if (addedOrderId) {
        //given
        const foundPendingOrder: OrderResDTO = service.findOrderById(
          addedOrderId,
          OrderState.ORDERS_PENDING
        );

        //when
        setup.changeExampleWorkerAvailibility(true);
        service.executePendingOrder(addedOrderId, setup.workerId);

        //then
        const foundOrderInProgress: OrderResDTO = service.findOrderById(
          addedOrderId,
          OrderState.ORDERS_IN_PROGRESS
        );
        assert.deepEqualExcluding(
          foundOrderInProgress,
          foundPendingOrder,
          'cookId'
        );
        assert.equal(foundOrderInProgress.cookId, setup.workerId);
        assert.throws(() => {
          service.findOrderById(addedOrderId, OrderState.ORDERS_PENDING);
        }, OrdersStoreError);
      } else assert.fail('No order found.');
    });

    it('Should update attached cook status to not available after attaching the cook to the order', () => {
      // all necessary backoffice states are set in setup class

      if (addedOrderId) {
        //when
        setup.changeExampleWorkerAvailibility(true);
        service.executePendingOrder(addedOrderId, setup.workerId);

        //then
        const assertedCook: WorkerDTO = backoffice.findWorker(setup.workerId);
        assert.isFalse(assertedCook.isAvailable);
      } else assert.fail('No order found.');
    });

    it('Should decrease ingredient qtys after creating a new order at place while a cook is also available.', () => {
      // all necessary backoffice states are set in setup class
      //given

      if (addedOrderId) {
        //when
        setup.changeExampleWorkerAvailibility(true);
        service.executePendingOrder(addedOrderId, setup.workerId);

        //then
        const foundOrderInProgress: OrderResDTO = service.findOrderById(
          addedOrderId,
          OrderState.ORDERS_IN_PROGRESS
        );

        const ingredient1FromStore: number = setup.ingredientQty1.qty;
        const ingredient2FromStore: number = setup.ingredientQty2.qty;
        const ingredient3FromStore: number = setup.ingredientQty3.qty;

        const makeExpectedIngredient = (i: number): number =>
          setup.ingredientsAfterCooking2MockedPizzas(
            foundOrderInProgress.orderItems[0].qty,
            foundOrderInProgress.orderItems[1].qty
          )[i].qty;

        assert.equal(ingredient1FromStore, makeExpectedIngredient(0));
        assert.equal(ingredient2FromStore, makeExpectedIngredient(1));
        assert.equal(ingredient3FromStore, makeExpectedIngredient(2));
      } else assert.fail('No order found.');
    });
  });

  describe('unsuccessed path test:', () => {
    it('Should throw WorkersStoreError on try to executePendingOrder by cook who is not available.', () => {
      // all necessary backoffice states are set in setup class
      if (addedOrderId) {
        //when
        //then
        assert.throws(() => {
          service.executePendingOrder(addedOrderId, setup.workerId);
        }, WorkersStoreError);
      } else assert.fail('No order found.');
    });

    it('Should throw WorkersStoreError on try to executePendingOrder by not existing cook.', () => {
      // all necessary backoffice states are set in setup class
      if (addedOrderId) {
        //when
        //then
        assert.throws(() => {
          service.executePendingOrder(addedOrderId, 'notExisting');
        }, WorkersStoreError);
      } else assert.fail('No order found.');
    });

    it('Should throw OrdersStoreError on try to executePendingOrder with not existing order id.', () => {
      // all necessary backoffice states are set in setup class
      if (addedOrderId) {
        //when
        //then
        assert.throws(() => {
          service.executePendingOrder('notExisting', setup.workerId);
        }, OrdersStoreError);
      } else assert.fail('No order found.');
    });

    it('Should throw error on try to executePendingOrder while there is no ingredients on stock required', () => {
      // all necessary backoffice states are set in setup class

      if (addedOrderId) {
        //given
        setup.changeExampleWorkerAvailibility(true);
        setup.makeIngredientOutOfStock();
        //when//then
        assert.throws(() => {
          service.executePendingOrder(addedOrderId, setup.workerId);
        }, IngretientStoreError);
      } else assert.fail('No order found.');
    });
  });
});
