import { HotelPaymentMethodsDO } from "../../../../../../../../../../services/settings/data-objects/HotelPaymentMethodsDO";
import { HotelAggregatedPaymentMethodsDO } from "../../../../../../../../../../services/settings/data-objects/HotelAggregatedPaymentMethodsDO";
import { CurrencyDO } from "../../../../../../../../../../services/common/data-objects/currency/CurrencyDO";

export class InvoiceOperationsPageData {
    private _allPaymentMethods: HotelPaymentMethodsDO;
    private _allowedPaymentMethods: HotelAggregatedPaymentMethodsDO;
    private _ccy: CurrencyDO;

    public get allPaymentMethods(): HotelPaymentMethodsDO {
        return this._allPaymentMethods;
    }
    public set allPaymentMethods(allPaymentMethods: HotelPaymentMethodsDO) {
        this._allPaymentMethods = allPaymentMethods;
    }
    public get allowedPaymentMethods(): HotelAggregatedPaymentMethodsDO {
        return this._allowedPaymentMethods;
    }
    public set allowedPaymentMethods(allowedPaymentMethods: HotelAggregatedPaymentMethodsDO) {
        this._allowedPaymentMethods = allowedPaymentMethods;
    }
    public get ccy(): CurrencyDO {
        return this._ccy;
    }
    public set ccy(ccy: CurrencyDO) {
        this._ccy = ccy;
    }
}
