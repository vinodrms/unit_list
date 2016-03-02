import {CustomerDO} from '../../../../data-objects/CustomerDO';

export class CustomerRepositoryHelper {
	public buildCustomerDOFrom(dbCustomer: Object): CustomerDO {
		var customer: CustomerDO = new CustomerDO();
		customer.buildFromObject(dbCustomer);
		return customer;
	}
	public buildCustomerDOListFrom(dbCustomerList: Array<Object>): CustomerDO[] {
		var list: CustomerDO[] = [];
		dbCustomerList.forEach((dbCustomer: Object) => {
			list.push(this.buildCustomerDOFrom(dbCustomer));
		});
		return list;
	}
}