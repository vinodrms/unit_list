import { ThError } from '../../../utils/th-responses/ThError';
import { AppContext } from '../../../utils/AppContext';
import { ThTimestampDO } from '../../../utils/th-dates/data-objects/ThTimestampDO';
import { HotelDO } from '../../../data-layer/hotel/data-objects/HotelDO';
import { BookingDO } from '../../../data-layer/bookings/data-objects/BookingDO';
import { BookingSearchResultRepoDO } from '../../../data-layer/bookings/repositories/IBookingRepository';
import { IBookingProcessStrategy, BookingStrategyMatchParams } from './strategies/IBookingProcessStrategy';
import { IBookingStatusChangerProcess } from './IBookingStatusChangerProcess';

import _ = require('underscore');

export class BookingStatusChangerProcess implements IBookingStatusChangerProcess {
    private _referenceTimestamp: ThTimestampDO;

    constructor(private _appContext: AppContext, private _hotel: HotelDO, private _processStrategy: IBookingProcessStrategy) {
    }

    public changeStatuses(referenceTimestamp: ThTimestampDO): Promise<BookingDO[]> {
        this._referenceTimestamp = referenceTimestamp;
        return new Promise<BookingDO[]>((resolve: { (result: BookingDO[]): void }, reject: { (err: ThError): void }) => {
            this.changeStatusesCore(resolve, reject);
        });
    }

    private changeStatusesCore(resolve: { (result: BookingDO[]): void }, reject: { (err: ThError): void }) {
        var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
        bookingsRepo.getBookingList({ hotelId: this._hotel.id }, this._processStrategy.getMatchingSearchCriteria(this.getBookingStrategyMatchParams()))
            .then((bookingSearchResult: BookingSearchResultRepoDO) => {
                var bookingList: BookingDO[] = bookingSearchResult.bookingList;
                return this.updateBookingList(bookingList);
            }).then((bookingList: BookingDO[]) => {
                var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
                return bookingsRepo.updateMultipleBookings({ hotelId: this._hotel.id }, bookingList);
            }).then((updatedBookingList: BookingDO[]) => {
                resolve(updatedBookingList);
            }).catch((error: any) => {
                reject(error);
            });
    }
    private updateBookingList(bookingList: BookingDO[]): Promise<BookingDO[]> {
        let promiseList: Promise<BookingDO>[] = [];
        bookingList.forEach(booking => {
            promiseList.push(this._processStrategy.updateMatchedBooking(booking, this.getBookingStrategyMatchParams()));
        });
        return Promise.all(promiseList);
    }
    private getBookingStrategyMatchParams(): BookingStrategyMatchParams {
        return {
            cancellationHour: this._hotel.operationHours.cancellationHour,
            referenceTimestamp: this._referenceTimestamp
        };
    }
}