import {BaseDO} from '../../../../../common/base/BaseDO';
import {CustomerDO} from './CustomerDO';

import * as _ from "underscore";

export class CustomersDO extends BaseDO {
	customerList: CustomerDO[];

	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.customerList = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "customerList"), (custObject: Object) => {
			var custDO = new CustomerDO();
			custDO.buildFromObject(custObject);
			this.customerList.push(custDO);
		});
	}

	public getCustomerById(customerId: string): CustomerDO {
		return _.find(this.customerList, (customer: CustomerDO) => { return customer.id === customerId });
	}

	public appendCustomer(customerToAppend: CustomerDO) {
		if(!this.getCustomerById(customerToAppend.id)) {
			this.customerList.push(customerToAppend);
		}
	}
	public removeCustomer(customer: CustomerDO) {
		this.customerList = _.filter(this.customerList, (currentCustomer: CustomerDO) => { return currentCustomer.id !== customer.id });
	}
}