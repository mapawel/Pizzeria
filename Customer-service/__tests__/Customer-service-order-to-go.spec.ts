import { assert } from 'chai';
import { OrderResDTO } from '../../Orders/DTO/Order-res.dto';
import { CustomerService } from '../Customer.service';
import { OrdersServiceError } from '../../Orders/exceptions/Orders-service.exception';
import { BackofficeService } from '../../Backoffice-service/Backoffice.service';
import { CustomerServiceSpecSetup } from './Customer-service.spec-setup';

describe('Customer service tests suite - orderToGo variants:', () => {
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
    it('Should create a new order to go. It can be done if there is a cook available only but free table.', () => {
      //given
      setup.changeExampleTableAvailibility(false);
      //when
      const addedOrder: OrderResDTO = service.orderToGo([
        {
          pizzaNameId: setup.pizza1NameId,
          qty: 2,
        },
        {
          pizzaNameId: setup.pizza2NameId,
          qty: 1,
        },
      ]);

      //then
      console.log('addedOrder ----> ', addedOrder);
    });

    // it('Should throw OrdersServiceError due to no cook available to prepare a new order.', () => {
    //   assert.throws(() => {
    //     service.orderToGo([
    //       {
    //         pizzaNameId: pizza1NameId,
    //         qty: 2,
    //       },
    //       {
    //         pizzaNameId: pizza2NameId,
    //         qty: 1,
    //       },
    //     ]);
    //   }, OrdersServiceError);
    // });
  });
});
