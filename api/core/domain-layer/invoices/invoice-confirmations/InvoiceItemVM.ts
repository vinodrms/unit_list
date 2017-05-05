import { ThTranslation } from '../../../utils/localization/ThTranslation';
import { ThUtils } from '../../../../core/utils/ThUtils';

import { InvoiceItemDO, InvoiceItemAccountingType } from '../../../data-layer/invoices/data-objects/items/InvoiceItemDO';
import { TaxDO } from '../../../data-layer/taxes/data-objects/TaxDO';

export class InvoiceItemVM {
    private _thUtils: ThUtils;

    name: string;
    qty: number;
    netUnitPrice: number;
    vat: number;
    vatPercentage: number;
    subtotal: number;
    isLastOne: boolean;

    constructor(private _thTranslation: ThTranslation) {
        this._thUtils = new ThUtils();
        this.isLastOne = false;
    }

    public buildFromInvoiceItemDO(invoiceItemDO: InvoiceItemDO, vatTaxList: TaxDO[]) {
        this.name = invoiceItemDO.meta.getDisplayName(this._thTranslation);
        this.qty = invoiceItemDO.meta.getNumberOfItems() * ((invoiceItemDO.accountingType === InvoiceItemAccountingType.Credit)? -1 : 1);
        
        var vatValue = this.getVatValue(invoiceItemDO.meta.getVatId(), vatTaxList);
        this.vatPercentage = this._thUtils.roundNumberToTwoDecimals(vatValue * 100);
        this.netUnitPrice = this._thUtils.roundNumberToTwoDecimals(invoiceItemDO.meta.getUnitPrice() / (1 + vatValue));
        var unitVat = this._thUtils.roundNumberToTwoDecimals(invoiceItemDO.meta.getUnitPrice() - this.netUnitPrice);
        this.vat = this._thUtils.roundNumberToTwoDecimals(unitVat * this.qty);
        this.subtotal = this._thUtils.roundNumberToTwoDecimals(this.qty * this.netUnitPrice);
    }

    private getVatValue(vatId: string, vatTaxList: TaxDO[]): number {
        if (this._thUtils.isUndefinedOrNull(vatId)) {
            return 0.0;
        }
        var vat = _.find(vatTaxList, (vat: TaxDO) => {
            return vat.id === vatId;
        });
        if (this._thUtils.isUndefinedOrNull(vat)) {
            return 0.0;
        }
        return vat.value;
    }
}