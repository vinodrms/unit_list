import {InvoiceItemDO} from '../data-objects/items/InvoiceItemDO';
import {ThTranslation} from '../../../../../common/utils/localization/ThTranslation';
import {ThUtils} from '../../../../../common/utils/ThUtils';

export class InvoiceItemVM {
    private _thUtils: ThUtils;

    invoiceItemDO: InvoiceItemDO;

    constructor(private _thTranslation: ThTranslation) {
        this._thUtils = new ThUtils();
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
        return this._thUtils.roundNumberToTwoDecimals(this.invoiceItemDO.meta.getUnitPrice() * this.qty);
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