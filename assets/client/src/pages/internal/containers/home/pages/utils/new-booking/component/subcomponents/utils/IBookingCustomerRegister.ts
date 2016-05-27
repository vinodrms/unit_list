import {Observable} from 'rxjs/Observable';
import {CustomerDO} from '../../../../../../../../services/customers/data-objects/CustomerDO';

export interface IBookingCustomerRegisterSelector {
	selectCustomerFromRegister(): Observable<CustomerDO>;
}
export interface IBookingCustomerRegisterController {	
	closeCustomerRegister();
	didSelectCustomer(customer: CustomerDO);
}