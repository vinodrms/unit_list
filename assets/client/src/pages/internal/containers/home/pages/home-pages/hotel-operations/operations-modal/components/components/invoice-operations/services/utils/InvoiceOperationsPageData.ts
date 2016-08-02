import {CustomersDO} from '../../../../../../../../../../../services/customers/data-objects/CustomersDO';
import {CurrencyDO} from '../../../../../../../../../../../services/common/data-objects/currency/CurrencyDO';
import {HotelPaymentMethodsDO} from '../../../../../../../../../../../services/settings/data-objects/HotelPaymentMethodsDO';
import {InvoiceGroupDO} from '../../../../../../../../../../../services/invoices/data-objects/InvoiceGroupDO';


export class InvoiceOperationsPageData {
    private _invoiceGroupDO: InvoiceGroupDO;
    private _allPaymentMethods: HotelPaymentMethodsDO;
    private _allowedPaymentMethods: HotelPaymentMethodsDO;
    private _customersContainer: CustomersDO; 
    private _ccy: CurrencyDO;

    public get invoiceGroupDO(): InvoiceGroupDO {
        return this._invoiceGroupDO;
    }
    public set invoiceGroupDO(invoiceGroupDO: InvoiceGroupDO) {
        this._invoiceGroupDO = invoiceGroupDO;
    }
    public get allPaymentMethods(): HotelPaymentMethodsDO {
        return this._allPaymentMethods;
    }
    public set allPaymentMethods(allPaymentMethods: HotelPaymentMethodsDO) {
        this._allPaymentMethods = allPaymentMethods;
    }
    public get allowedPaymentMethods(): HotelPaymentMethodsDO {
        return this._allowedPaymentMethods;
    }
    public set allowedPaymentMethods(allowedPaymentMethods: HotelPaymentMethodsDO) {
        this._allowedPaymentMethods = allowedPaymentMethods;
    }
    public get customersContainer(): CustomersDO {
        return this._customersContainer;
    }
    public set customersContainer(customersContainer: CustomersDO) {
        this._customersContainer = customersContainer;
    }  
    public get ccy(): CurrencyDO {
        return this._ccy;
    }
    public set ccy(ccy: CurrencyDO) {
        this._ccy = ccy;
    } 
}