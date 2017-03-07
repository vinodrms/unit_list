import { ThDateIntervalDO } from '../../../utils/th-dates/data-objects/ThDateIntervalDO';
import { ThDateDO } from '../../../utils/th-dates/data-objects/ThDateDO';
import { ThTimestampDO } from '../../../utils/th-dates/data-objects/ThTimestampDO';
import { ThHourDO } from '../../../utils/th-dates/data-objects/ThHourDO';
import { ISOWeekDay } from '../../../utils/th-dates/data-objects/ISOWeekDay';

import _ = require('underscore');

export class IndexedBookingInterval {
    private static DefaultUtcCheckInHour = 14;
    private static DefaultUtcCheckOutHour = 12;
    private static MinUtcOverlappingHour = 10;
    private static MaxUtcOverlappingHour = 16;

    private _bookingDateList: ThDateDO[];
    private _indexedBookingInterval: ThDateIntervalDO;

    private _bookingISOWeekDayList: ISOWeekDay[];
    private _uniqueBookingISOWeekDayList: ISOWeekDay[];

    private _startUtcTimestamp: number;
    private _endUtcTimestamp: number;

    constructor(private _bookingInterval: ThDateIntervalDO) {
        this.indexBookingDateList();
        this.indexBookingISOWeekDayList();
        this.computeTimestamps();
    }
    private indexBookingDateList() {
        this._bookingDateList = this._bookingInterval.getThDateDOList();
        // the departure date is not considered a full staying day
        this._bookingDateList.pop();
        this._indexedBookingInterval = ThDateIntervalDO.buildThDateIntervalDO(this._bookingDateList[0], this._bookingDateList[this._bookingDateList.length - 1]);
    }
    private indexBookingISOWeekDayList() {
        this._bookingISOWeekDayList = [];
        _.forEach(this._bookingDateList, (bookingDate: ThDateDO) => {
            this._bookingISOWeekDayList.push(bookingDate.getISOWeekDay());
        });
        this._uniqueBookingISOWeekDayList = _.uniq(this._bookingISOWeekDayList);
    }
    private computeTimestamps() {
        this._startUtcTimestamp = this.getUtcTimestamp(this._bookingInterval.start, IndexedBookingInterval.DefaultUtcCheckInHour);
        this._endUtcTimestamp = this.getUtcTimestamp(this._bookingInterval.end, IndexedBookingInterval.DefaultUtcCheckOutHour);
    }
    private getUtcTimestamp(thDate: ThDateDO, defaultHour: number): number {
        var thTimestamp = new ThTimestampDO();
        thTimestamp.thDateDO = thDate;
        thTimestamp.thHourDO = ThHourDO.buildThHourDO(defaultHour, 0);
        return thTimestamp.getUtcTimestamp();
    }

    public get bookingDateList(): ThDateDO[] {
        return this._bookingDateList;
    }
    public set bookingDateList(bookingDateList: ThDateDO[]) {
        this._bookingDateList = bookingDateList;
    }

    public get bookingISOWeekDayList(): ISOWeekDay[] {
        return this._bookingISOWeekDayList;
    }
    public set bookingISOWeekDayList(bookingISOWeekDayList: ISOWeekDay[]) {
        this._bookingISOWeekDayList = bookingISOWeekDayList;
    }

    public get uniqueBookingISOWeekDayList(): ISOWeekDay[] {
        return this._uniqueBookingISOWeekDayList;
    }
    public set uniqueBookingISOWeekDayList(uniqueBookingISOWeekDayList: ISOWeekDay[]) {
        this._uniqueBookingISOWeekDayList = uniqueBookingISOWeekDayList;
    }

    public getArrivalDate(): ThDateDO {
        return this._bookingInterval.start;
    }
    public getDepartureDate(): ThDateDO {
        return this._bookingInterval.end;
    }
    public getNoLeadDays(currentHotelThDate: ThDateDO): number {
        var leadThDateIntervalDO = new ThDateIntervalDO();
        leadThDateIntervalDO.start = currentHotelThDate;
        leadThDateIntervalDO.end = this.getArrivalDate();
        var noLeadDays = leadThDateIntervalDO.getNumberOfDays();

        // because you can make bookings from yesterday (e.g. after midnight), the lead days can be negative
        if (noLeadDays < 0) {
            noLeadDays = 0;
        }
        return noLeadDays;
    }
    public getLengthOfStay(): number {
        return this._bookingInterval.getNumberOfDays();
    }

    public getStartUtcTimestamp(): number {
        return this._startUtcTimestamp;
    }
    public getEndUtcTimestamp(): number {
        return this._endUtcTimestamp;
    }

    public get indexedBookingInterval(): ThDateIntervalDO {
        return this._indexedBookingInterval;
    }
    public set indexedBookingInterval(indexedBookingInterval: ThDateIntervalDO) {
        this._indexedBookingInterval = indexedBookingInterval;
    }

    public overlapsWith(otherIndexedBookingInterval: IndexedBookingInterval): boolean {
        return (
            (this._startUtcTimestamp <= otherIndexedBookingInterval.getStartUtcTimestamp() &&
                this._endUtcTimestamp >= otherIndexedBookingInterval.getStartUtcTimestamp()
            ) ||
            (this._startUtcTimestamp >= otherIndexedBookingInterval.getStartUtcTimestamp() &&
                this._startUtcTimestamp <= otherIndexedBookingInterval.getEndUtcTimestamp()
            )
        );
    }
    public static getOverlappingUtcTimestampIntervalForDate(thDate: ThDateDO): { minUtcTimestamp: number, maxUtcTimestamp: number } {
        var minTimestampDO = ThTimestampDO.buildThTimestampDO(thDate.buildPrototype(), ThHourDO.buildThHourDO(IndexedBookingInterval.MinUtcOverlappingHour, 0));
        var maxTimestampDO = ThTimestampDO.buildThTimestampDO(thDate.buildPrototype(), ThHourDO.buildThHourDO(IndexedBookingInterval.MaxUtcOverlappingHour, 0));
        return {
            minUtcTimestamp: minTimestampDO.getUtcTimestamp(),
            maxUtcTimestamp: maxTimestampDO.getUtcTimestamp()
        }
    }
}