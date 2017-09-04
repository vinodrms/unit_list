import * as _ from "underscore";
import { BaseDO } from '../../../../../common/base/BaseDO';
import { InvoiceDO } from './InvoiceDO';

export class InvoicesDO extends BaseDO {
    invoiceList: InvoiceDO[];

    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }
    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.invoiceList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "invoiceList"), (invoiceObject: Object) => {
            var invoice = new InvoiceDO();
            invoice.buildFromObject(invoiceObject);
            this.invoiceList.push(invoice);
        });
    }

    public getUniqueCustomerIdList(): string[] {
        var customerIdList: string[] = [];
        _.forEach(this.invoiceList, (invoice: InvoiceDO) => {
            customerIdList = customerIdList.concat(invoice.getCustomerIdList());
        });
        return _.uniq(customerIdList);
    }
}
