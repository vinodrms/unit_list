import {CustomerDO} from '../../../../data-layer/customers/data-objects/CustomerDO';

import _ = require('underscore');

export class CustomersContainer {
    private _customerList: CustomerDO[];

    constructor(customerList: CustomerDO[]) {
        this._customerList = customerList;
    }

    public get customerList(): CustomerDO[] {
        return this._customerList;
    }
    public set customerList(customerList: CustomerDO[]) {
        this._customerList = customerList;
    }

    public getCustomerById(customerId: string): CustomerDO {
        return _.find(this._customerList, (customer: CustomerDO) => {
            return customer.id === customerId;
        });
    }
}