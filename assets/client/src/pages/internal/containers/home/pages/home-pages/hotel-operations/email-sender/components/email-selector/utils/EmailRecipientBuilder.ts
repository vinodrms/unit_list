import {EmailRecipientVM} from './EmailRecipientVM';
import {CustomerDO} from '../../../../../../../../../services/customers/data-objects/CustomerDO';

import * as _ from "underscore";

export class EmailRecipientBuilder {
    private _indexedCustomers: { [id: string]: CustomerDO; };

    constructor(customerList: CustomerDO[]) {
        this._indexedCustomers = _.indexBy(customerList, (customer: CustomerDO) => { return customer.id });
    }

    public getEmailRecipientList(cachedSelectedRecipientIdList: string[]): EmailRecipientVM[] {
        var recipientList: EmailRecipientVM[] = [];
        var customerIdList: string[] = _.keys(this._indexedCustomers);
        _.forEach(customerIdList, (customerId: string) => {
            var recipientCustomer: CustomerDO = this._indexedCustomers[customerId];
            var recipient = new EmailRecipientVM(recipientCustomer.id, recipientCustomer.customerName, recipientCustomer.emailString);
            if (_.contains(cachedSelectedRecipientIdList, recipientCustomer.id)) {
                recipient.selected = true;
            }
            recipientList.push(recipient);
        });
        return recipientList;
    }
}