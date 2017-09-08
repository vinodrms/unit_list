import { InvoiceDO } from "../data-objects/InvoiceDO";
import { CustomerDO } from "../../customers/data-objects/CustomerDO";
import { InvoiceMeta } from "../data-objects/InvoiceMeta";

import _ = require('underscore');

export class InvoiceVM {
    private _invoice: InvoiceDO;
    private _customerList: CustomerDO[];
    private _invoiceMeta: InvoiceMeta;

    public get invoice(): InvoiceDO {
        return this._invoice;
    }
    public set invoice(value: InvoiceDO) {
        this._invoice = value;
    }

    public get invoiceMeta(): InvoiceMeta {
        return this._invoiceMeta;
    }
    public set invoiceMeta(value: InvoiceMeta) {
        this._invoiceMeta = value;
    }

    public get customerList(): CustomerDO[] {
        return this._customerList;
    }
    public set customerList(value: CustomerDO[]) {
        this._customerList = value;
    }
    public getFirstPayerName(): string {
        return (this._customerList.length > 0 ) ? this._customerList[0].customerName : "";
    }
    public getFirstPayerEmail(): string {
        return (this._customerList.length > 0 ) ? this._customerList[0].emailString : "";
    }

    public getCustomerDO(id: string): CustomerDO {
        return _.find(this.customerList, (customer: CustomerDO) => {
            return customer.id === id;
        });
    }

    public addCustomer(customerToAdd: CustomerDO) {
        if (!_.find(this.customerList, (customer: CustomerDO) => {
            return customer.id === customerToAdd.id;
        })) {
            this.customerList.push(customerToAdd);
        };
    }

    public removeCustomer(customerId: string) {
        this.customerList = _.without(this.customerList, _.findWhere(this.customerList, {
            id: customerId
        }));
    }
}
