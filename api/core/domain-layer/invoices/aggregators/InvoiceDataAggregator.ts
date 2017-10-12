import _ = require('underscore');
import { ThLogger, ThLogLevel } from '../../../utils/logging/ThLogger';
import { ThError } from '../../../utils/th-responses/ThError';
import { ThUtils } from '../../../utils/ThUtils';
import { ThStatusCode } from '../../../utils/th-responses/ThResponse';
import { AppContext } from '../../../utils/AppContext';
import { SessionContext } from '../../../utils/SessionContext';
import { InvoiceAggregatedData } from './InvoiceAggregatedData';
import { BookingDO } from '../../../data-layer/bookings/data-objects/BookingDO';
import { BookingSearchResultRepoDO } from '../../../data-layer/bookings/repositories/IBookingRepository';
import { RoomCategoryDO } from '../../../data-layer/room-categories/data-objects/RoomCategoryDO';
import { CustomerMetaRepoDO, CustomerSearchResultRepoDO } from '../../../data-layer/customers/repositories/ICustomerRepository';
import { CustomerDO } from '../../../data-layer/customers/data-objects/CustomerDO';
import { HotelDO } from '../../../data-layer/hotel/data-objects/HotelDO';
import { AddOnProductMetaRepoDO, AddOnProductSearchResultRepoDO } from '../../../data-layer/add-on-products/repositories/IAddOnProductRepository';
import { AddOnProductDO } from '../../../data-layer/add-on-products/data-objects/AddOnProductDO';
import { TaxResponseRepoDO } from '../../../data-layer/taxes/repositories/ITaxRepository';
import { TaxDO } from '../../../data-layer/taxes/data-objects/TaxDO';
import { CurrencyDO } from '../../../data-layer/common/data-objects/currency/CurrencyDO';
import { PaymentMethodDO } from '../../../data-layer/common/data-objects/payment-method/PaymentMethodDO';
import { RoomDO } from '../../../data-layer/rooms/data-objects/RoomDO';
import { InvoiceDO } from "../../../data-layer/invoices/data-objects/InvoiceDO";
import { RoomCategorySearchResultRepoDO } from "../../../data-layer/room-categories/repositories/IRoomCategoryRepository";
import { RoomSearchResultRepoDO } from "../../../data-layer/rooms/repositories/IRoomRepository";
import { InvoicePayerDO } from '../../../data-layer/invoices/data-objects/payer/InvoicePayerDO';
import { InvoiceItemType } from '../../../data-layer/invoices/data-objects/items/InvoiceItemDO';
import { BookingPriceDO } from '../../../data-layer/bookings/data-objects/price/BookingPriceDO';


export interface InvoiceDataAggregatorQuery {
    invoiceId: string;
    customerId: string;
}

export class InvoiceDataAggregator {
    private _thUtils: ThUtils;

    private _hotel: HotelDO;
    private _invoice: InvoiceDO;

    private _loadedGuestList: CustomerDO[];
    private _loadedRoomList: RoomDO[];

    private _payerCustomer: CustomerDO;
    private _payerIndexOnInvoice: number;
    private _addOnProductList: AddOnProductDO[];
    private _paymentMethodList: PaymentMethodDO[];
    private _currencyList: CurrencyDO[];
    private _vatList: TaxDO[];
    private _otherTaxesList: TaxDO[];

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
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

            var invoiceRepo = this._appContext.getRepositoryFactory().getInvoiceRepository();
            return invoiceRepo.getInvoiceById({ hotelId: this._hotel.id }, query.invoiceId);
        }).then((invoiceDO: InvoiceDO) => {
            this._vatList = invoiceDO.vatTaxListSnapshot;
            this._invoice = invoiceDO;

            return this.getGuestCustomerList();
        }).then((guestList: CustomerDO[]) => {
            this._loadedGuestList = guestList;

            let roomRepo = this._appContext.getRepositoryFactory().getRoomRepository();
            return roomRepo.getRoomList({ hotelId: this._sessionContext.sessionDO.hotel.id });
        }).then((roomSearchResult: RoomSearchResultRepoDO) => {
            this._loadedRoomList = roomSearchResult.roomList;

            var customerRepo = this._appContext.getRepositoryFactory().getCustomerRepository();
            return customerRepo.getCustomerById({ hotelId: this._hotel.id }, query.customerId);
        }).then((customer: CustomerDO) => {
            this._payerCustomer = customer;
            this._payerIndexOnInvoice = _.findIndex(this._invoice.payerList, (payer: InvoicePayerDO) => {
                return payer.customerId === customer.id;
            });
            if (this._payerIndexOnInvoice < 0) {
                var thError = new ThError(ThStatusCode.InvoiceDataAggregatorCustomerNotFoundAsPayer, null);
                ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "the customer is not a payer on the invoice", query, thError);
                throw thError;
            }

            var addOnProductRepo = this._appContext.getRepositoryFactory().getAddOnProductRepository();
            return addOnProductRepo.getAddOnProductList({ hotelId: this._hotel.id }, { addOnProductIdList: this._invoice.getAddOnProductIdList() });
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

    private getGuestCustomerList(): Promise<CustomerDO[]> {
        let customerIdList: string[] = [];
        this._invoice.itemList.forEach(item => {
            if (item.type === InvoiceItemType.Booking) {
                let customerId: string = (<BookingPriceDO>item.meta).customerId;
                if (_.isString(customerId) && customerId.length > 0) {
                    customerIdList.push(customerId);
                }
            }
        });
        customerIdList = _.uniq(customerIdList);
        return new Promise<CustomerDO[]>((resolve: { (result: CustomerDO[]): void }, reject: { (err: ThError): void }) => {
            if (customerIdList.length == 0) {
                resolve([]);
                return;
            }
            let customerRepo = this._appContext.getRepositoryFactory().getCustomerRepository();
            customerRepo.getCustomerList({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                customerIdList: customerIdList
            }).then(result => {
                resolve(result.customerList);
            }).catch(e => {
                reject(e);
            });
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
        invoiceAggregatedData.payerIndexOnInvoice = this._payerIndexOnInvoice;
        invoiceAggregatedData.paymentMethodList = this._paymentMethodList;
        invoiceAggregatedData.addSharedInvoiceItemIfNecessary();
        invoiceAggregatedData.guestList = this._loadedGuestList;
        invoiceAggregatedData.roomList = this._loadedRoomList;
        return invoiceAggregatedData;
    }

    private get hotelId(): string {
        return this._sessionContext.sessionDO.hotel.id;
    }
}
