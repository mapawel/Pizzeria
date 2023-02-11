import { CustomerService } from '../../Customer-service/Customer.service';

describe('Customer service tests suite:', () => {
  //setup
  let service: CustomerService;

  beforeEach(() => {
    service = CustomerService.getInstance();
  });

  afterEach(() => {
    CustomerService.resetInstance();
  });

  describe('... test:', () => {
    it('should ...', () => {});
  });
});
