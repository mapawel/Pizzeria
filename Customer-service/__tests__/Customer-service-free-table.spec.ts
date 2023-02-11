import chai from 'chai';
import chaiExclude from 'chai-exclude';
import { assert } from 'chai';
import { CustomerService } from '../Customer.service';
import { BackofficeService } from '../../Backoffice-service/Backoffice.service';
import { CustomerServiceSpecSetup } from './Customer-service.spec-setup';
import { OrderItem } from '../../Orders/Order/Order-item.type';
import { OrdersStoreError } from '../../Orders/exceptions/Orders-store.exception';
import { OrderResDTO } from '../../Orders/DTO/Order-res.dto';
import { TableDTO } from 'Tables/DTO/Table.dto';

chai.use(chaiExclude);

describe('Customer service tests suite - makeOrderTableFree() variants:', () => {
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

    const addedOrder: OrderResDTO = service.orderIn(orderItems, personsToOrder);
    addedOrderId = addedOrder.id;
  });

  afterEach(() => {
    CustomerService.resetInstance();
    BackofficeService.resetInstance();
  });

  describe('happy path test:', () => {
    it('Should update table status to availale after makeOrderTableFree() and also retrive a number of sits available at this table.', () => {
      // all necessary backoffice states are set in setup class

      if (addedOrderId) {
        //given
        service.finishOrder(addedOrderId);

        //when
        service.makeOrderTableFree(addedOrderId);

        //then
        const assertedTable: TableDTO = backoffice.findTableById(setup.tableId);
        assert.isTrue(assertedTable.isAvailable);
        assert.equal(assertedTable.sitsAvailable, setup.tableSitsAvailable);
      } else assert.fail('No order found.');
    });
  });

  describe('unsuccessed path test:', () => {
    it('Should throw OrdersStoreError on try to makeOrderTableFree with not existing order id.', () => {
      // all necessary backoffice states are set in setup class
      if (addedOrderId) {
        //when
        //then
        assert.throws(() => {
          service.makeOrderTableFree('notExisting');
        }, OrdersStoreError);
      } else assert.fail('No order found.');
    });
  });
});
