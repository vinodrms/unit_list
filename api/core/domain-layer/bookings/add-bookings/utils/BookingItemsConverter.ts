import { AddBookingItemsDO, BookingItemDO } from '../AddBookingItemsDO';
import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { ThLogger, ThLogLevel } from '../../../../utils/logging/ThLogger';
import { ThError } from '../../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../../utils/th-responses/ThResponse';
import { ThTimestampDO } from '../../../../utils/th-dates/data-objects/ThTimestampDO';
import { GroupBookingInputChannel, BookingDO, BookingStatus, BookingConfirmationStatus } from '../../../../data-layer/bookings/data-objects/BookingDO';
import { ThUtils } from '../../../../utils/ThUtils';
import { IndexedBookingInterval } from '../../../../data-layer/price-products/utils/IndexedBookingInterval';
import { DocumentHistoryDO } from '../../../../data-layer/common/data-objects/document-history/DocumentHistoryDO';
import { DocumentActionDO } from '../../../../data-layer/common/data-objects/document-history/DocumentActionDO';
import { PriceProductDO } from '../../../../data-layer/price-products/data-objects/PriceProductDO';
import { PriceProductsContainer } from '../../../price-products/validators/results/PriceProductsContainer';
import { HotelDO } from '../../../../data-layer/hotel/data-objects/HotelDO';
import { BookingUtils } from '../../utils/BookingUtils';
import { ThDateIntervalDO } from '../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import { BookingPriceDO, BookingPriceType } from '../../../../data-layer/bookings/data-objects/price/BookingPriceDO';
import { CustomersContainer } from '../../../customers/validators/results/CustomersContainer';
import { AddOnProductItemContainer, AddOnProductItem } from '../../../add-on-products/validators/AddOnProductLoader';
import { AddOnProductDO } from '../../../../data-layer/add-on-products/data-objects/AddOnProductDO';
import { InvoiceItemDO, InvoiceItemType } from '../../../../data-layer/invoices/data-objects/items/InvoiceItemDO';
import { TaxDO, TaxType } from '../../../../data-layer/taxes/data-objects/TaxDO';
import { RoomCategoryStatsDO } from '../../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO';
import { IHotelRepository, SequenceValue } from "../../../../data-layer/hotel/repositories/IHotelRepository";
import { HotelSequenceType } from "../../../../data-layer/hotel/data-objects/sequences/HotelSequencesDO";

import _ = require('underscore');
import moment = require('moment');
import shortid = require('shortid');

export class BookingItemsConverterParams {
    priceProductsContainer: PriceProductsContainer;
    hotelDO: HotelDO;
    currentHotelTimestamp: ThTimestampDO;
    customersContainer: CustomersContainer;
    addOnProductItemContainer: AddOnProductItemContainer;
    vatTaxList: TaxDO[];
    roomCategoryStatsList: RoomCategoryStatsDO[];
    groupBookingReference?: string;
}

export class BookingItemsConverter {

    private static MAX_BOOKINGS_PER_DAY = 99999;

    private _thUtils: ThUtils;
    private _bookingUtils: BookingUtils;

    private _bookingItems: BookingItemDO[];
    private _inputChannel: GroupBookingInputChannel;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext, private _converterParams: BookingItemsConverterParams) {
        this._thUtils = new ThUtils();
        this._bookingUtils = new BookingUtils();
    }
    public convert(bookingItems: BookingItemDO[], inputChannel: GroupBookingInputChannel): Promise<BookingDO[]> {
        this._bookingItems = bookingItems;
        this._inputChannel = inputChannel;

        return new Promise<BookingDO[]>((resolve: { (result: BookingDO[]): void }, reject: { (err: ThError): void }) => {
            try {
                this.convertCore(resolve, reject);
            } catch (error) {
                var thError = new ThError(ThStatusCode.BookingItemsConverterError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error converting booking items", this._bookingItems, thError);
                reject(thError);
            }
        });
    }

    private convertCore(resolve: { (result: BookingDO[]): void }, reject: { (err: ThError): void }) {
        var bookingList: BookingDO[] = [];

        var hotelId = this._sessionContext.sessionDO.hotel.id;
        var groupBookingStatus = BookingStatus.Active;
        var noOfRooms = this._bookingItems.length;
        let groupBookingRoomCategoryIdList = this.getRoomCategoryIdListWithinGroupBooking();

        let bookingIndex = 1;
        let groupBookingId = this._thUtils.generateUniqueID();

        this.generateReference().then((groupBookingReference: string) => {
            _.forEach(this._bookingItems, (bookingItem: BookingItemDO) => {
                var bookingDO = new BookingDO();

                var bookingInterval = new ThDateIntervalDO();
                bookingInterval.buildFromObject(bookingItem.interval);

                bookingDO.groupBookingId = groupBookingId;
                bookingDO.groupBookingReference = groupBookingReference;
                bookingDO.bookingReference = bookingIndex.toString();
                bookingIndex++;
                bookingDO.hotelId = hotelId;
                bookingDO.status = groupBookingStatus;
                bookingDO.inputChannel = this._inputChannel;
                bookingDO.noOfRooms = noOfRooms;

                bookingDO.confirmationStatus = BookingConfirmationStatus.Confirmed;
                bookingDO.customerIdList = bookingItem.customerIdList;

                bookingDO.defaultBillingDetails = bookingItem.defaultBillingDetails;
                if (this._thUtils.isUndefinedOrNull(bookingDO.defaultBillingDetails.customerIdDisplayedAsGuest)) {
                    bookingDO.defaultBillingDetails.customerIdDisplayedAsGuest =
                        bookingDO.defaultBillingDetails.customerId;
                }

                bookingDO.roomCategoryId = bookingItem.roomCategoryId;
                bookingDO.priceProductId = bookingItem.priceProductId;
                bookingDO.reservedAddOnProductIdList = [];
                bookingDO.allotmentId = bookingItem.allotmentId;
                bookingDO.externalBookingReference = bookingItem.externalBookingReference;
                bookingDO.notes = bookingItem.notes;
                bookingDO.invoiceNotes = bookingItem.invoiceNotes;
                bookingDO.interval = bookingInterval;
                bookingDO.creationDate = this._converterParams.currentHotelTimestamp.thDateDO;
                bookingDO.creationDateUtcTimestamp = bookingDO.creationDate.getUtcTimestamp();

                var indexedBookingInterval = new IndexedBookingInterval(bookingDO.interval);
                bookingDO.startUtcTimestamp = indexedBookingInterval.getStartUtcTimestamp();
                bookingDO.endUtcTimestamp = indexedBookingInterval.getEndUtcTimestamp();
                bookingDO.configCapacity = bookingItem.configCapacity;
                bookingDO.fileAttachmentList = [];
                bookingDO.bookingHistory = new DocumentHistoryDO();
                bookingDO.bookingHistory.logDocumentAction(DocumentActionDO.buildDocumentActionDO({
                    actionParameterMap: {},
                    actionString: "Booking was created",
                    userId: this._sessionContext.sessionDO.user.id
                }));

                var priceProduct = this._converterParams.priceProductsContainer.getPriceProductById(bookingDO.priceProductId);
                this._bookingUtils.updateBookingGuaranteedAndNoShowTimes(bookingDO, {
                    priceProduct: priceProduct,
                    hotel: this._converterParams.hotelDO,
                    currentHotelTimestamp: this._converterParams.currentHotelTimestamp
                });

                let billingCustomer = this._converterParams.customersContainer.getCustomerById(bookingDO.defaultBillingDetails.customerId);
                this._bookingUtils.updateBookingPriceUsingRoomCategoryAndSavePPSnapshot(bookingDO, this._converterParams.roomCategoryStatsList,
                    priceProduct, billingCustomer, groupBookingRoomCategoryIdList);

                this._bookingUtils.updateDisplayCustomerId(bookingDO, this._converterParams.customersContainer);
                this._bookingUtils.updateCorporateDisplayCustomerId(bookingDO, this._converterParams.customersContainer);                
                bookingDO.defaultBillingDetails.customerIdDisplayedAsGuest = bookingDO.displayCustomerId;
                this._bookingUtils.updateIndexedSearchTerms(bookingDO, this._converterParams.customersContainer);

                bookingDO.price.vatId = this.getBookingTaxId(priceProduct);
                bookingList.push(bookingDO);
            });

            resolve(bookingList);
        }).catch((error) => {
            reject(error);
        });
    }
    private getRoomCategoryIdListWithinGroupBooking(): string[] {
        return _.map(this._bookingItems, bookingItem => { return bookingItem.roomCategoryId; })
    }
    private getBookingTaxId(priceProduct: PriceProductDO): string {
        var filteredTaxList: TaxDO[] = _.filter(this._converterParams.vatTaxList, (tax: TaxDO) => {
            return tax.type === TaxType.Vat && _.contains(priceProduct.taxIdList, tax.id);
        });
        if (filteredTaxList.length > 0) {
            return filteredTaxList[0].id;
        }
        return null;
    }

    private generateReference(): Promise<string> {
        return new Promise<string>((resolve: { (result: string): void }, reject: { (err: ThError): void }) => {
            this.generateReferenceCore(resolve, reject);
        });
    }

    private generateReferenceCore(resolve: { (result: string): void }, reject: { (err: ThError): void }) {
        if (!this._thUtils.isUndefinedOrNull(this._converterParams.groupBookingReference)) {
            resolve(this._converterParams.groupBookingReference);
            return;
        }

        let hotelRepo: IHotelRepository = this._appContext.getRepositoryFactory().getHotelRepository();
        hotelRepo.getNextSequenceValue(this._sessionContext.sessionDO.hotel.id, HotelSequenceType.BookingGroup)
            .then((seqValue: SequenceValue) => {
                resolve(this.getReferenceFromSeqValue(seqValue.sequence.toString()));
            }).catch((error) => {
                var thError = new ThError(ThStatusCode.BookingItemsConverterReferenceGenerationError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error generating booking reference", this._bookingItems, thError);
                reject(thError);
            });
    }

    private getReferenceFromSeqValue(seqValue: string) {
        let now = new Date();
        return moment(now).format('MMDDYY') + this.leftPad('0', seqValue);
    }

    private leftPad(padString: string, input: string): string {
        let idLength = BookingItemsConverter.MAX_BOOKINGS_PER_DAY.toString().length;
        while (input.length < idLength)
            input = padString + input;
        return input;
    }
}