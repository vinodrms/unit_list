import {InvoiceDO} from '../data-objects/InvoiceDO';
import {InvoicePayerDO} from '../data-objects/payers/InvoicePayerDO';
import {CustomerDO} from '../../../services/customers/data-objects/CustomerDO';
import {CurrencyDO} from '../../../services/common/data-objects/currency/CurrencyDO';

export class InvoicePayerVM {
    invoicePayerDO: InvoicePayerDO;
    customerDO: CustomerDO;
    invoiceDO: InvoiceDO;
    ccy: CurrencyDO;

    constructor() {
    }
    
    public get totalAmount(): number {
        return this.invoiceDO.getPrice();
    }
}