import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {ThUtils} from '../../../../utils/ThUtils';
import {BookingPossiblePricesDO} from './BookingPossiblePricesDO';
import {BookingDO} from '../../../../data-layer/bookings/data-objects/BookingDO';
import {PriceProductPriceQueryDO} from '../../../../data-layer/price-products/data-objects/price/IPriceProductPrice';
import {ValidationResultParser} from '../../../common/ValidationResultParser';
import {BookingPossiblePriceItems, BookingPriceItem} from './utils/BookingPossiblePriceItems';
import {IndexedBookingInterval} from '../../../../data-layer/price-products/utils/IndexedBookingInterval';
import {BookingUtils} from '../../../bookings/utils/BookingUtils';

import _ = require('underscore');

export class BookingPossiblePrices {
    private _thUtils: ThUtils;
    private _bookingUtils: BookingUtils;

    private _possiblePricesDO: BookingPossiblePricesDO;

    private _loadedBooking: BookingDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
        this._bookingUtils = new BookingUtils();
    }

    public getPossiblePrices(possiblePricesDO: BookingPossiblePricesDO): Promise<BookingPossiblePriceItems> {
        this._possiblePricesDO = possiblePricesDO;
        return new Promise<BookingPossiblePriceItems>((resolve: { (result: BookingPossiblePriceItems): void }, reject: { (err: ThError): void }) => {
            this.getPossiblePricesCore(resolve, reject);
        });
    }
    private getPossiblePricesCore(resolve: { (result: BookingPossiblePriceItems): void }, reject: { (err: ThError): void }) {
        var validationResult = BookingPossiblePricesDO.getValidationStructure().validateStructure(this._possiblePricesDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._possiblePricesDO);
            parser.logAndReject("Error validating check out room fields", reject);
            return;
        }
        var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
        bookingsRepo.getBookingById({ hotelId: this._sessionContext.sessionDO.hotel.id }, this._possiblePricesDO.groupBookingId, this._possiblePricesDO.bookingId)
            .then((booking: BookingDO) => {
                this._loadedBooking = booking;

                resolve(this.getBookingPossiblePriceItems());
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.BookingPossiblePricesError, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error getting booking possible prices", this._possiblePricesDO, thError);
                }
                reject(thError);
            });
    }

    private getBookingPossiblePriceItems(): BookingPossiblePriceItems {
        var indexedBookingInterval = new IndexedBookingInterval(this._loadedBooking.interval);
        var noOfNights = indexedBookingInterval.getLengthOfStay();

        var possibleItems = new BookingPossiblePriceItems();
        _.forEach(this._loadedBooking.priceProductSnapshot.roomCategoryIdList, (roomCategoryId: string) => {
            var priceQuery: PriceProductPriceQueryDO = {
                roomCategoryId: roomCategoryId,
                configCapacity: this._loadedBooking.configCapacity
            };

            if (this._loadedBooking.priceProductSnapshot.price.hasPriceConfiguredFor(priceQuery)) {
                var priceItem = new BookingPriceItem();
                priceItem.roomCategoryId = roomCategoryId;
                priceItem.price = noOfNights * this._loadedBooking.priceProductSnapshot.price.getPricePerNightFor(priceQuery);
                var includedInvoiceItems = this._bookingUtils.getIncludedInvoiceItems(this._loadedBooking.priceProductSnapshot,
                    this._loadedBooking.configCapacity, indexedBookingInterval);
                priceItem.price += includedInvoiceItems.getTotalPrice();
                priceItem.price = this._thUtils.roundNumberToTwoDecimals(priceItem.price);
                possibleItems.priceItemList.push(priceItem);
            }
        });
        return possibleItems;
    }
}