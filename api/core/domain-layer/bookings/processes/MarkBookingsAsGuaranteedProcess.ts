import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {ThTimestampDO} from '../../../utils/th-dates/data-objects/ThTimestampDO';
import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';
import {BookingDO, BookingConfirmationStatus} from '../../../data-layer/bookings/data-objects/BookingDO';
import {BookingSearchResultRepoDO} from '../../../data-layer/bookings/repositories/IBookingRepository';
import {DocumentActionDO} from '../../../data-layer/common/data-objects/document-history/DocumentActionDO';

import _ = require('underscore');

export class MarkBookingsAsGuaranteedProcess {
    private _referenceTimestamp: ThTimestampDO;

    constructor(private _appContext: AppContext, private _hotel: HotelDO) {
    }

    public markBookingsAsGuaranteed(referenceTimestamp: ThTimestampDO): Promise<BookingDO[]> {
        this._referenceTimestamp = referenceTimestamp;
        return new Promise<BookingDO[]>((resolve: { (result: BookingDO[]): void }, reject: { (err: ThError): void }) => {
            this.markBookingsAsGuaranteedCore(resolve, reject);
        });
    }

    private markBookingsAsGuaranteedCore(resolve: { (result: BookingDO[]): void }, reject: { (err: ThError): void }) {
        var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
        bookingsRepo.getBookingList({ hotelId: this._hotel.id }, {
            confirmationStatusList: [BookingConfirmationStatus.Confirmed],
            triggerParams: {
                triggerName: BookingDO.GuaranteedTriggerName,
                cancellationHour: this._hotel.operationHours.cancellationHour,
                currentHotelTimestamp: this._referenceTimestamp
            }
        }).then((bookingSearchResult: BookingSearchResultRepoDO) => {
            var bookingList: BookingDO[] = bookingSearchResult.bookingList;
            this.updateBookingListToGuaranteed(bookingList);
            var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
            return bookingsRepo.updateMultipleBookings({ hotelId: this._hotel.id }, bookingList);
        }).then((updatedBookingList: BookingDO[]) => {
            resolve(updatedBookingList);
        }).catch((error: any) => {
            reject(error);
        });
    }
    private updateBookingListToGuaranteed(bookingList: BookingDO[]) {
        _.forEach(bookingList, (bookingDO: BookingDO) => {
            this.updateBookingToGuaranteed(bookingDO);
        });
    }
    private updateBookingToGuaranteed(bookingDO: BookingDO) {
        if (bookingDO.confirmationStatus !== BookingConfirmationStatus.Confirmed || !bookingDO.priceProductSnapshot.conditions.policy.hasCancellationPolicy()) {
            return;
        }
        bookingDO.confirmationStatus = BookingConfirmationStatus.Guaranteed;
        bookingDO.bookingHistory.logDocumentAction(DocumentActionDO.buildDocumentActionDO({
            actionParameterMap: {},
            actionString: "Booking was marked as Guaranteed by the System"
        }));
    }
}