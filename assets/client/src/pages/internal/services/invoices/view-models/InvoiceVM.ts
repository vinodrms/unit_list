import {InvoiceDO} from '../data-objects/InvoiceDO';
import {InvoicePayerDO} from '../data-objects/payers/InvoicePayerDO';
import {InvoiceItemDO} from '../data-objects/items/InvoiceItemDO';
import {InvoicePayerVM} from './InvoicePayerVM';
import {InvoiceItemVM} from './InvoiceItemVM';
import {CustomersDO} from '../../customers/data-objects/CustomersDO';
import {CustomerDO} from '../../customers/data-objects/CustomerDO';
import {ThTranslation} from '../../../../../common/utils/localization/ThTranslation';

export class InvoiceVM {
    invoiceDO: InvoiceDO;
    invoicePayerVMList: InvoicePayerVM[];
    invoceItemVMList: InvoiceItemVM[];
    newlyAdded: boolean;

    constructor(private _thTranslation: ThTranslation) {
    }

    public buildCleanInvoiceVM() {
        this.invoiceDO = new InvoiceDO();
        this.invoiceDO.buildCleanInvoice();
        this.invoicePayerVMList = [];
        var invoicePayerVM = new InvoicePayerVM(this._thTranslation);
        invoicePayerVM.invoicePayerDO = this.invoiceDO.payerList[0];
        invoicePayerVM.newlyAdded = true;
        this.invoicePayerVMList.push(invoicePayerVM);
        this.invoceItemVMList = [];
        this.newlyAdded = true;
    }

    public buildFromInvoiceDOAndCustomersDO(invoice: InvoiceDO, customersDO: CustomersDO) {
        this.invoiceDO = invoice;

        this.invoicePayerVMList = [];
        _.forEach(this.invoiceDO.payerList, (invoicePayerDO: InvoicePayerDO) => {
            var invoicePayerVM = new InvoicePayerVM(this._thTranslation);
            invoicePayerVM.buildFromInvoicePayerDOAndCustomersDO(invoicePayerDO, customersDO);
            this.invoicePayerVMList.push(invoicePayerVM);
        });

        this.invoceItemVMList = [];
        _.forEach(this.invoiceDO.itemList, (invoiceItemDO: InvoiceItemDO) => {
            var invoiceItemVM = new InvoiceItemVM(this._thTranslation);
            invoiceItemVM.buildFromInvoiceItem(invoiceItemDO);
            this.invoceItemVMList.push(invoiceItemVM);
        });
    }

    public get totalPrice(): number {
        return this.invoiceDO.getPrice();
    }
    public get isNewlyAdded(): boolean {
        return this.newlyAdded;
    }
}