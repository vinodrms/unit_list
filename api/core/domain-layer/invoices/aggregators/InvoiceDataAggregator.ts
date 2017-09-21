import { ThLogger, ThLogLevel } from '../../../utils/logging/ThLogger';
import { ThError } from '../../../utils/th-responses/ThError';
import { ThUtils } from '../../../utils/ThUtils';
import { ThStatusCode } from '../../../utils/th-responses/ThResponse';
import { AppContext } from '../../../utils/AppContext';
import { SessionContext } from '../../../utils/SessionContext';
import { InvoiceAggregatedData, BookingAttachment } from './InvoiceAggregatedData';
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

import _ = require('underscore');


export interface InvoiceDataAggregatorQuery {
    invoiceId: string;
    customerId: string;
    payerIndex: number;
}

export class InvoiceDataAggregator {
    private _thUtils: ThUtils;

    private _hotel: HotelDO;
    private _invoice: InvoiceDO;

    private _loadedBookings: BookingDO[];
    private _loadedRoomCateg: RoomCategoryDO[];
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

            return this.loadBookingDependencies();
        }).then((loadResult: boolean) => {
            var invoicePayerDO = this._invoice.payerList[query.payerIndex];
            var customerRepo = this._appContext.getRepositoryFactory().getCustomerRepository()
            return customerRepo.getCustomerById({ hotelId: this._hotel.id }, invoicePayerDO.customerId);
        }).then((customer: CustomerDO) => {
            this._payerCustomer = customer;
            this._payerIndexOnInvoice = query.payerIndex;

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

    private loadBookingDependencies(): Promise<boolean> {
        return new Promise<boolean>((resolve: { (result: boolean): void }, reject: { (err: ThError): void }) => {
            this.loadBookingDependenciesCore(resolve, reject);
        });
    }
    private loadBookingDependenciesCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
        if (this._thUtils.isUndefinedOrNull(this._invoice.indexedBookingIdList) || this._invoice.indexedBookingIdList.length == 0) {
            resolve(false);
            return;
        }
        var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
        bookingsRepo.getBookingList({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
            bookingIdList: this._invoice.indexedBookingIdList
        }).then((searchResult: BookingSearchResultRepoDO) => {
            this.loadAdditionalBookingDependencies(resolve, reject, searchResult.bookingList);
        }).catch((err: any) => {
            reject(err);
        });
    }
    private loadAdditionalBookingDependencies(resolve: { (result: boolean): void }, reject: { (err: ThError): void }, bookingList: BookingDO[]) {
        if (bookingList.length === 0) {
            resolve(false);
            return;
        }
        this._loadedBookings = bookingList;
        var roomCategRepo = this._appContext.getRepositoryFactory().getRoomCategoryRepository();
        roomCategRepo.getRoomCategoryList({ hotelId: this._sessionContext.sessionDO.hotel.id }, {categoryIdList: _.map(this._loadedBookings, (booking: BookingDO) => { return booking.roomCategoryId;})})
            .then((roomCategorySearchResult: RoomCategorySearchResultRepoDO) => {
                this._loadedRoomCateg = roomCategorySearchResult.roomCategoryList;

                let customerIdList: string[] = [];
                customerIdList = _.map(this._loadedBookings, (booking: BookingDO) => {
                    let customerIdDisplayedAsGuest = booking.defaultBillingDetails.customerIdDisplayedAsGuest;
                    if (this._thUtils.isUndefinedOrNull(customerIdDisplayedAsGuest)) {
                        customerIdDisplayedAsGuest = booking.defaultBillingDetails.customerId;
                    }
                    return customerIdDisplayedAsGuest;
                });

                var custRepo = this._appContext.getRepositoryFactory().getCustomerRepository();
                return custRepo.getCustomerList({ hotelId: this._hotel.id }, {customerIdList: customerIdList});
            }).then((customerRepoSearchResultDO: CustomerSearchResultRepoDO) => {
                this._loadedGuestList = customerRepoSearchResultDO.customerList;
                return this.getRoomsIfSet();
            }).then((roomSearchResult: RoomSearchResultRepoDO) => {
                if (!this._thUtils.isUndefinedOrNull(roomSearchResult, "roomList")) {
                    this._loadedRoomList = roomSearchResult.roomList;
                } else {
                    this._loadedRoomList = [];
                }
                resolve(true);
            }).catch((err: any) => {
                reject(err);
            });
    }

    private getRoomsIfSet(): Promise<RoomSearchResultRepoDO> {
        let roomIdList = [];
        _.forEach(this._loadedBookings, (booking: BookingDO) => {
            if (_.isString(booking.roomId)) {
                roomIdList.push(booking.roomId);
            }
        });
        /*
        if (!_.isString(this._loadedBookings.roomId)) {
            return new Promise<RoomDO>((resolve: { (result: RoomDO): void }, reject: { (err: ThError): void }) => {
                resolve(null);
            });
        }*/
        if (roomIdList.length == 0) {
            return new Promise<RoomSearchResultRepoDO>((resolve: { (result: RoomSearchResultRepoDO): void }, reject: { (err: ThError): void }) => {
                resolve(null);
            });    
        }
        var roomRepo = this._appContext.getRepositoryFactory().getRoomRepository();
        return roomRepo.getRoomList({ hotelId: this._sessionContext.sessionDO.hotel.id }, {roomIdList: roomIdList});
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
        if (this._thUtils.isUndefinedOrNull(this._loadedBookings) || this._thUtils.isUndefinedOrNull(this._loadedRoomCateg)) {
            invoiceAggregatedData.bookingAttachments = { exists: false };
        }
        else {
            invoiceAggregatedData.bookingAttachments = {
                exists: true,
                guests: this._loadedGuestList,
                roomCategories: this._loadedRoomCateg,
                bookings: this._loadedBookings,
                rooms: this._loadedRoomList
            }
        }
        return invoiceAggregatedData;
    }

    private get hotelId(): string {
        return this._sessionContext.sessionDO.hotel.id;
    }
}
