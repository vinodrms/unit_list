import { ThTranslation } from '../../../utils/localization/ThTranslation';
import { ThUtils } from '../../../../core/utils/ThUtils';
import { TaxDO } from '../../../data-layer/taxes/data-objects/TaxDO';
import { InvoiceItemDO } from "../../../data-layer/invoices/data-objects/items/InvoiceItemDO";
import _ = require("underscore");


export class InvoiceItemVM {
    private _thUtils: ThUtils;

    name: string;
    qty: number;

    netUnitPrice: number;
    netUnitPriceFormatted: string;

    vat: number;
    vatFormatted: string;

    vatPercentage: number;
    vatPercentageFormatted: string;

    subtotal: number;
    subtotalFormatted: string;

    isLastOne: boolean;

    constructor(private _thTranslation: ThTranslation) {
        this._thUtils = new ThUtils();
        this.isLastOne = false;
    }

    public buildFromInvoiceItemDO(invoiceItemDO: InvoiceItemDO, vatTaxList: TaxDO[]) {
        this.name = invoiceItemDO.meta.getDisplayName(this._thTranslation);
        this.qty = invoiceItemDO.meta.getNumberOfItems();

        var vatValue = this.getVatValue(invoiceItemDO.meta.getVatId(), vatTaxList);
        this.vatPercentage = this._thUtils.roundNumberToTwoDecimals(vatValue * 100);
        this.netUnitPrice = this._thUtils.roundNumberToTwoDecimals(invoiceItemDO.meta.getUnitPrice() / (1 + vatValue));
        var unitVat = this._thUtils.roundNumberToTwoDecimals(invoiceItemDO.meta.getUnitPrice() - this.netUnitPrice);
        this.vat = this._thUtils.roundNumberToTwoDecimals(unitVat * this.qty);
        this.subtotal = this._thUtils.roundNumberToTwoDecimals(this.qty * this.netUnitPrice);

        this.formatPrices();
    }

    public formatPrices() {
        this.vatPercentageFormatted = this._thUtils.formatNumberToTwoDecimals(this.vatPercentage);
        this.netUnitPriceFormatted = this._thUtils.formatNumberToTwoDecimals(this.netUnitPrice);
        this.vatFormatted = this._thUtils.formatNumberToTwoDecimals(this.vat);
        this.subtotalFormatted = this._thUtils.formatNumberToTwoDecimals(this.subtotal);
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
