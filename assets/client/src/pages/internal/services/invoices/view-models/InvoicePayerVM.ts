import {InvoiceDO} from '../data-objects/InvoiceDO';
import {InvoicePayerDO} from '../data-objects/payers/InvoicePayerDO';
import {CustomerDO} from '../../../services/customers/data-objects/CustomerDO';
import {CustomersDO} from '../../../services/customers/data-objects/CustomersDO';
import {CurrencyDO} from '../../../services/common/data-objects/currency/CurrencyDO';
import {ThTranslation} from '../../../../../common/utils/localization/ThTranslation';

export class InvoicePayerVM {
    invoicePayerDO: InvoicePayerDO;
    customerDO: CustomerDO;
    newlyAdded: boolean;

    constructor(private _thTranslation: ThTranslation) {
    }

    public buildFromInvoicePayerDOAndCustomersDO(invoicePayerDO: InvoicePayerDO, customersDO: CustomersDO) {
        this.invoicePayerDO = invoicePayerDO;
        this.customerDO = customersDO.getCustomerById(invoicePayerDO.customerId);
    }
    public buildFromCustomerDO(customerDO: CustomerDO) {
        this.customerDO = customerDO;
        this.invoicePayerDO = new InvoicePayerDO();
        this.invoicePayerDO.customerId = customerDO.id;
        this.invoicePayerDO.priceToPay = 0;
    }
    public get isNewlyAdded(): boolean {
        return this.newlyAdded;
    }

    public buildPrototype(): InvoicePayerVM {
        var invoicePayerVMCopy = new InvoicePayerVM(this._thTranslation);
        invoicePayerVMCopy.newlyAdded = this.newlyAdded;

        var customerDOCopy = new CustomerDO();
        customerDOCopy.buildFromObject(this.customerDO);
        invoicePayerVMCopy.customerDO = customerDOCopy;

        var invoicePayerDOCopy = new InvoicePayerDO();
        invoicePayerDOCopy.buildFromObject(this.invoicePayerDO);
        invoicePayerVMCopy.invoicePayerDO = invoicePayerDOCopy;
        
        return invoicePayerVMCopy;
    }
}