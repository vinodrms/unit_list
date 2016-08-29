import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThUtils} from '../../../utils/ThUtils';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {InvoiceAggregatedData} from './InvoiceAggregatedData';
import {InvoiceGroupMetaRepoDO} from '../../../data-layer/invoices/repositories/IInvoiceGroupsRepository';
import {InvoiceGroupDO} from '../../../data-layer/invoices/data-objects/InvoiceGroupDO';
import {InvoiceDO} from '../../../data-layer/invoices/data-objects/InvoiceDO';
import {CustomerMetaRepoDO} from '../../../data-layer/customers/repositories/ICustomerRepository';
import {CustomerDO} from '../../../data-layer/customers/data-objects/CustomerDO';
import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';
import {AddOnProductMetaRepoDO, AddOnProductSearchResultRepoDO} from '../../../data-layer/add-on-products/repositories/IAddOnProductRepository';
import {AddOnProductDO} from '../../../data-layer/add-on-products/data-objects/AddOnProductDO';
import {TaxResponseRepoDO} from '../../../data-layer/taxes/repositories/ITaxRepository';
import {TaxDO} from '../../../data-layer/taxes/data-objects/TaxDO';
import {CurrencyDO} from '../../../data-layer/common/data-objects/currency/CurrencyDO';
import {PaymentMethodDO} from '../../../data-layer/common/data-objects/payment-method/PaymentMethodDO';

export interface InvoiceDataAggregatorQuery {
    invoiceGroupId: string;
    invoiceReference: string;
    customerId: string;
    payerIndex: number;
}

export class InvoiceDataAggregator {
    private _hotel: HotelDO;
    private _invoice: InvoiceDO;
    private _payerCustomer: CustomerDO;
    private _payerIndexOnInvoice: number;
    private _addOnProductList: AddOnProductDO[];
    private _paymentMethodList: PaymentMethodDO[];
    private _currencyList: CurrencyDO[];
    private _vatList: TaxDO[];
    private _otherTaxesList: TaxDO[];

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
    }

    public getInvoiceAggregatedData(query: InvoiceDataAggregatorQuery): Promise<InvoiceAggregatedData> {
        return new Promise<InvoiceAggregatedData>((resolve: { (result: InvoiceAggregatedData): void }, reject: { (err: ThError): void }) => {
            this.getInvoiceAggregatedDataCore(resolve, reject, query);
        });
    }

    private getInvoiceAggregatedDataCore(resolve: { (result: InvoiceAggregatedData): void }, reject: { (err: ThError): void }, query: InvoiceDataAggregatorQuery) {
        var hotelRepo = this._appContext.getRepositoryFactory().getHotelRepository();
        hotelRepo.getHotelById(this.hotelId).then((hotel: HotelDO) => {
            this._hotel = hotel;

            var invoiceGroupsRepo = this._appContext.getRepositoryFactory().getInvoiceGroupsRepository();
            return invoiceGroupsRepo.getInvoiceGroupById({ hotelId: this._hotel.id }, query.invoiceGroupId);
        }).then((invoiceGroupDO: InvoiceGroupDO) => {
            this._invoice = _.find(invoiceGroupDO.invoiceList, (invoice: InvoiceDO) => {
                return query.invoiceReference === invoice.invoiceReference;
            });

            var taxRepo = this._appContext.getRepositoryFactory().getTaxRepository();
            return taxRepo.getTaxList({ hotelId: this._hotel.id });
        }).then((result: TaxResponseRepoDO) => {
            this._vatList = result.vatList;
            this._otherTaxesList = result.otherTaxList;

            var invoicePayerDO = this._invoice.payerList[query.payerIndex];

            var customerRepo = this._appContext.getRepositoryFactory().getCustomerRepository()
            return customerRepo.getCustomerById({ hotelId: this._hotel.id }, invoicePayerDO.customerId);
        }).then((customer: CustomerDO) => {
            this._payerCustomer = customer;
            this._payerIndexOnInvoice = query.payerIndex;

            var addOnProductRepo = this._appContext.getRepositoryFactory().getAddOnProductRepository();
            return addOnProductRepo.getAddOnProductList({ hotelId: this._hotel.id }, this._invoice.getAddOnProductIdList());
        }).then((result: AddOnProductSearchResultRepoDO) => {
            this._addOnProductList = result.addOnProductList;

            return this._appContext.getRepositoryFactory().getSettingsRepository().getCurrencies(); 
        }).then((result: CurrencyDO[]) => {
            this._currencyList = result;

            return this._appContext.getRepositoryFactory().getSettingsRepository().getPaymentMethods();
        }).then((result: PaymentMethodDO[]) => {
            this._paymentMethodList = result;
            
            resolve(this.buildInvoiceAggregatedDataContainerFromLoadedData());
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.InvoiceConfirmationErrorGettingData, error);
            if (thError.isNativeError()) {
                ThLogger.getInstance().logError(ThLogLevel.Error, "error fetching invoice confirmation data", query, thError);
            }
            reject(thError);
        });
    }
    
    private buildInvoiceAggregatedDataContainerFromLoadedData(): InvoiceAggregatedData {
        var invoiceAggregatedData = new InvoiceAggregatedData(this._sessionContext);
        invoiceAggregatedData.hotel = this._hotel;
        invoiceAggregatedData.ccySymbol = _.find(this._currencyList, (ccy: CurrencyDO) => {
            return ccy.code === this._hotel.ccyCode;
        }).symbol;
        invoiceAggregatedData.invoice = this._invoice;
        invoiceAggregatedData.payerCustomer = this._payerCustomer;
        invoiceAggregatedData.addOnProductList = this._addOnProductList;
        invoiceAggregatedData.vatList = this._vatList;
        invoiceAggregatedData.otherTaxes = this._otherTaxesList;
        invoiceAggregatedData.payerIndexOnInvoice = this._payerIndexOnInvoice;
        invoiceAggregatedData.paymentMethodList = this._paymentMethodList;
        invoiceAggregatedData.addSharedInvoiceItemIfNecessary();
        return invoiceAggregatedData;
    }

    

    private get hotelId(): string {
        return this._sessionContext.sessionDO.hotel.id;
    }
}