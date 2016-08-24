import {InvoiceItemDO} from '../data-objects/items/InvoiceItemDO';
import {ThTranslation} from '../../../../../common/utils/localization/ThTranslation';

export class InvoiceItemVM {
    invoiceItemDO: InvoiceItemDO;

    constructor(private _thTranslation: ThTranslation) {
    }

    public buildFromInvoiceItem(invoiceItemDO: InvoiceItemDO) {
        this.invoiceItemDO = invoiceItemDO;
    }

    public get itemDisplayText(): string {
        return this.invoiceItemDO.meta.getDisplayName(this._thTranslation);
    }
    public get qty(): number {
        return this.invoiceItemDO.meta.getNumberOfItems();
    }
    public get price(): number {
        return this.invoiceItemDO.meta.getUnitPrice();
    }
    public get totalPrice(): number {
        return this.invoiceItemDO.meta.getUnitPrice() * this.qty;
    }
    public isMovable():boolean {
        return this.invoiceItemDO.meta.isMovable();
    }

    public buildPrototype(): InvoiceItemVM {
        var invoiceItemVMCopy = new InvoiceItemVM(this._thTranslation);
        var invoiceItemDOCopy = new InvoiceItemDO();
        invoiceItemDOCopy.buildFromObject(this.invoiceItemDO);
        invoiceItemVMCopy.invoiceItemDO = invoiceItemDOCopy;
        return invoiceItemVMCopy;
    }
}