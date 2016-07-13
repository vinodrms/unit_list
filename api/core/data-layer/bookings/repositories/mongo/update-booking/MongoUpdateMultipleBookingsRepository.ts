import {BookingMetaRepoDO, BookingItemMetaRepoDO} from '../../IBookingRepository';
import {BookingDO, GroupBookingStatus} from '../../../data-objects/BookingDO';
import {IUpdateSingleBookingRepository} from './IUpdateSingleBookingRepository';
import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';

import _ = require('underscore');
import async = require('async');

export class MongoUpdateMultipleBookingsRepository {

    constructor(private _updateSingleBookingRepo: IUpdateSingleBookingRepository) {

    }

    public updateMultipleBookings(meta: BookingMetaRepoDO, bookingList: BookingDO[]): Promise<BookingDO[]> {
        return new Promise<BookingDO[]>((resolve: { (result: BookingDO[]): void }, reject: { (err: ThError): void }) => {
            this.updateMultipleBookingsCore(resolve, reject, meta, bookingList);
        });
    }
    private updateMultipleBookingsCore(resolve: { (result: BookingDO[]): void }, reject: { (err: ThError): void }, meta: BookingMetaRepoDO, bookingList: BookingDO[]) {
        if (bookingList.length == 0) {
            resolve([]);
            return;
        }
        var bookingGroups: { [id: string]: BookingDO[]; } = _.groupBy(bookingList, "groupBookingId");
        var groupBookingIdList: string[] = Object.keys(bookingGroups);

        var promiseList: Promise<BookingDO[]>[] = [];
        _.forEach(groupBookingIdList, (groupBookingId: string) => {
            var bookingListFromGroup: BookingDO[] = bookingGroups[groupBookingId];
            promiseList.push(this.updateBookingsWithingGroup(meta, groupBookingId, bookingListFromGroup));
        });
        Promise.all(promiseList).then((updatedBookingGroups: BookingDO[][]) => {
            var updatedBookingList: BookingDO[] = [];
            _.forEach(updatedBookingGroups, (bookingListFromGroup: BookingDO[]) => {
                updatedBookingList = updatedBookingList.concat(bookingListFromGroup);
            });
            resolve(updatedBookingList);
        }).catch((err: any) => {
            reject(err);
        });
    }

    private updateBookingsWithingGroup(meta: BookingMetaRepoDO, groupBookingId: string, bookingList: BookingDO[]): Promise<BookingDO[]> {
        return new Promise<BookingDO[]>((resolve: { (result: BookingDO[]): void }, reject: { (err: ThError): void }) => {
            this.updateBookingsWithingGroupCore(resolve, reject, meta, groupBookingId, bookingList);
        });
    }
    private updateBookingsWithingGroupCore(resolve: { (result: BookingDO[]): void }, reject: { (err: ThError): void }, meta: BookingMetaRepoDO, groupBookingId: string, bookingList: BookingDO[]) {
        if (bookingList.length == 0) {
            resolve([]);
            return;
        }
        var currentBookingIndex = 0;
        var currentVersionId = bookingList[currentBookingIndex].versionId;
        var updatedBookingList: BookingDO[] = [];
        async.whilst(
            (() => {
                return currentBookingIndex < bookingList.length;
            }),
            ((finishUpdateSingleBookingCallback: any) => {
                var booking = bookingList[currentBookingIndex];
                currentBookingIndex++;
                this._updateSingleBookingRepo.updateBooking(meta, { groupBookingId: groupBookingId, bookingId: booking.bookingId, versionId: currentVersionId }, booking)
                    .then((updatedBooking: BookingDO) => {
                        currentVersionId = updatedBooking.versionId;
                        updatedBookingList.push(updatedBooking);
                        finishUpdateSingleBookingCallback(null, updatedBooking);
                    }).catch((err: Error) => {
                        finishUpdateSingleBookingCallback(err);
                    });
            }),
            ((err: any) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(updatedBookingList);
                }
            })
        );
    }
}