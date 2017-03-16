import { AddBookingItemsDO, BookingItemDO } from '../AddBookingItemsDO';
import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { ThLogger, ThLogLevel } from '../../../../utils/logging/ThLogger';
import { ThError } from '../../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../../utils/th-responses/ThResponse';
import { ThTimestampDO } from '../../../../utils/th-dates/data-objects/ThTimestampDO';
import { GroupBookingInputChannel, BookingDO, GroupBookingStatus, BookingConfirmationStatus } from '../../../../data-layer/bookings/data-objects/BookingDO';
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
import { AddOnProductInvoiceItemMetaDO } from '../../../../data-layer/invoices/data-objects/items/add-on-products/AddOnProductInvoiceItemMetaDO';
import { TaxDO, TaxType } from '../../../../data-layer/taxes/data-objects/TaxDO';
import { RoomCategoryStatsDO } from '../../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO';

import _ = require('underscore');

export class BookingItemsConverterParams {
    priceProductsContainer: PriceProductsContainer;
    hotelDO: HotelDO;
    currentHotelTimestamp: ThTimestampDO;
    customersContainer: CustomersContainer;
    addOnProductItemContainer: AddOnProductItemContainer;
    vatTaxList: TaxDO[];
    roomCategoryStatsList: RoomCategoryStatsDO[];
}

export class BookingItemsConverter {
    public static GroupBookingReferencePrefix = "GR";
    public static IndividualBookingReferencePrefix = "BR";

    private _thUtils: ThUtils;
    private _bookingUtils: BookingUtils;

    private _bookingItems: AddBookingItemsDO
    private _inputChannel: GroupBookingInputChannel;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext, private _converterParams: BookingItemsConverterParams) {
        this._thUtils = new ThUtils();
        this._bookingUtils = new BookingUtils();
    }
    public convert(bookingItems: AddBookingItemsDO, inputChannel: GroupBookingInputChannel): Promise<BookingDO[]> {
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

        var groupBookingReference = this.generateGroupBookingReference();
        var hotelId = this._sessionContext.sessionDO.hotel.id;
        var groupBookingStatus = GroupBookingStatus.Active;
        var noOfRooms = this._bookingItems.bookingList.length;
        let groupBookingRoomCategoryIdList = this.getRoomCategoryIdListWithinGroupBooking();

        _.forEach(this._bookingItems.bookingList, (bookingItem: BookingItemDO) => {
            var bookingDO = new BookingDO();

            var bookingInterval = new ThDateIntervalDO();
            bookingInterval.buildFromObject(bookingItem.interval);

            bookingDO.groupBookingReference = groupBookingReference;
            bookingDO.hotelId = hotelId;
            bookingDO.status = groupBookingStatus;
            bookingDO.inputChannel = this._inputChannel;
            bookingDO.noOfRooms = noOfRooms;

            bookingDO.bookingId = this._thUtils.generateUniqueID();
            bookingDO.bookingReference = this.generateIndividualBookingReference();
            bookingDO.confirmationStatus = BookingConfirmationStatus.Confirmed;
            bookingDO.customerIdList = bookingItem.customerIdList;
            
            bookingDO.defaultBillingDetails = bookingItem.defaultBillingDetails;
            if(this._thUtils.isUndefinedOrNull(bookingDO.defaultBillingDetails.customerIdDisplayedAsGuest)) {
                bookingDO.defaultBillingDetails.customerIdDisplayedAsGuest = 
                    bookingDO.defaultBillingDetails.customerId;
            }

            bookingDO.roomCategoryId = bookingItem.roomCategoryId;
            bookingDO.priceProductId = bookingItem.priceProductId;
            bookingDO.reservedAddOnProductIdList = [];
            bookingDO.allotmentId = bookingItem.allotmentId;
            bookingDO.notes = bookingItem.notes;
            bookingDO.interval = bookingInterval;
            bookingDO.creationDate = this._converterParams.currentHotelTimestamp.thDateDO;

            var priceProduct = this._converterParams.priceProductsContainer.getPriceProductById(bookingDO.priceProductId);
            bookingDO.priceProductSnapshot = new PriceProductDO();
            bookingDO.priceProductSnapshot.buildFromObject(priceProduct);

            // remove the yield intervals on the snapshot to minimize the document size
            bookingDO.priceProductSnapshot.openForArrivalIntervalList = [];
            bookingDO.priceProductSnapshot.openForDepartureIntervalList = [];
            bookingDO.priceProductSnapshot.openIntervalList = [];

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

            this._bookingUtils.updateBookingGuaranteedAndNoShowTimes(bookingDO, {
                priceProduct: priceProduct,
                hotel: this._converterParams.hotelDO,
                currentHotelTimestamp: this._converterParams.currentHotelTimestamp
            });
            this._bookingUtils.updateBookingPriceUsingRoomCategory(bookingDO, this._converterParams.roomCategoryStatsList, groupBookingRoomCategoryIdList);
            this._bookingUtils.updateIndexedSearchTerms(bookingDO, this._converterParams.customersContainer);
            this._bookingUtils.updateDisplayCustomerId(bookingDO, this._converterParams.customersContainer);
            bookingDO.price.vatId = this.getBookingTaxId(priceProduct);

            bookingList.push(bookingDO);
        });
        resolve(bookingList);
    }
    private getRoomCategoryIdListWithinGroupBooking(): string[] {
        return _.map(this._bookingItems.bookingList, bookingItem => { return bookingItem.roomCategoryId; })
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

    private generateGroupBookingReference(): string {
        return BookingItemsConverter.GroupBookingReferencePrefix + this._thUtils.generateShortId();
    }
    private generateIndividualBookingReference(): string {
        return BookingItemsConverter.IndividualBookingReferencePrefix + this._thUtils.generateShortId();
    }
}