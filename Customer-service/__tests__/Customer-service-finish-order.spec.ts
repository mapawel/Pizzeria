import chai from 'chai';
import chaiExclude from 'chai-exclude';
import { assert } from 'chai';
import { CustomerService } from '../Customer.service';
import { BackofficeService } from '../../Backoffice-service/Backoffice.service';
import { CustomerServiceSpecSetup } from './Customer-service.spec-setup';
import { OrderItem } from '../../Orders/Order/Order-item.type';
import { OrderState } from '../../Orders/Order/orders-state.enum';
import { OrdersStoreError } from '../../Orders/exceptions/Orders-store.exception';
import { OrderResDTO } from '../../Orders/DTO/Order-res.dto';
import { WorkerDTO } from '../../Workers/DTO/Worker.dto';

chai.use(chaiExclude);

describe('Customer service tests suite - finishOrder() variants:', () => {
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
    it('Should move the order from "ordersInProgress" to "orfersFinished".', () => {
      // all necessary backoffice states are set in setup class

      if (addedOrderId) {
        //given
        setup.changeExampleWorkerAvailibility(true);
        service.executePendingOrder(addedOrderId, setup.workerId);
        //when
        service.finishOrder(addedOrderId);

        //then
        const foundOrderFinished: OrderResDTO = service.findOrderById(
          addedOrderId,
          OrderState.ORDERS_FINISHED
        );
        assert.equal(foundOrderFinished.cookId, setup.workerId);
        assert.throws(() => {
          service.findOrderById(addedOrderId, OrderState.ORDERS_IN_PROGRESS);
        }, OrdersStoreError);
      } else assert.fail('No order found.');
    });

    it('Should update cook status to availale after finishOrder()', () => {
      // all necessary backoffice states are set in setup class

      if (addedOrderId) {
        //given
        setup.changeExampleWorkerAvailibility(true);
        service.executePendingOrder(addedOrderId, setup.workerId);

        //when
        service.finishOrder(addedOrderId);
        const assertedCook: WorkerDTO = backoffice.findWorker(setup.workerId);
        assert.isTrue(assertedCook.isAvailable);
        //then
      } else assert.fail('No order found.');
    });
  });

  describe('unsuccessed path test:', () => {
    it('Should throw OrdersStoreError on try to finishOrder with not existing order id.', () => {
      // all necessary backoffice states are set in setup class
      if (addedOrderId) {
        //when
        //then
        assert.throws(() => {
          service.finishOrder('notExisting');
        }, OrdersStoreError);
      } else assert.fail('No order found.');
    });
  });
});
