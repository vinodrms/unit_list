import {ThTranslation} from '../../../utils/localization/ThTranslation';
import {ThUtils} from '../../../../core/utils/ThUtils';

import {InvoiceItemDO} from '../../../data-layer/invoices/data-objects/items/InvoiceItemDO';

export class InvoiceItemVM {
    private _thUtils: ThUtils;

    name: string;
    qty: number;
    netUnitPrice: number;
    vat: number;
    subtotal: number;

    constructor(private _thTranslation: ThTranslation) {
        this._thUtils = new ThUtils();
    }

    public buildFromInvoiceItemDO(invoiceItemDO: InvoiceItemDO) {
        this.name = invoiceItemDO.meta.getDisplayName(this._thTranslation);
        this.qty = invoiceItemDO.meta.getNumberOfItems();
        this.netUnitPrice = invoiceItemDO.meta.getUnitPrice();
        this.vat = 0;
        this.subtotal = this._thUtils.roundNumberToTwoDecimals(this.qty * this.netUnitPrice);
    }
}