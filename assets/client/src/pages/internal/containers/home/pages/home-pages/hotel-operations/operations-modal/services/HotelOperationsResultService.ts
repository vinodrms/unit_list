import {Injectable} from '@angular/core';
import {HotelOperationsResult} from './utils/HotelOperationsResult';
import {BookingDO} from '../../../../../../../services/bookings/data-objects/BookingDO';
import {RoomDO} from '../../../../../../../services/rooms/data-objects/RoomDO';

@Injectable()
export class HotelOperationsResultService {
    private _hotelOperationsResult: HotelOperationsResult;

    constructor() {
        this._hotelOperationsResult = new HotelOperationsResult();
    }

    public get hotelOperationsResult(): HotelOperationsResult {
        return this._hotelOperationsResult;
    }
    public set hotelOperationsResult(hotelOperationsResult: HotelOperationsResult) {
        this._hotelOperationsResult = hotelOperationsResult;
    }

    public markRoomChanged(changedRoom: RoomDO) {
        this._hotelOperationsResult.didChangeRoom = true;
    }
    public markBookingChanged(changedBooking: BookingDO) {
        this._hotelOperationsResult.didChangeBooking = true;
    }
    public markInvoiceChanged(changedInvoiceDO: any) {
        this._hotelOperationsResult.didChangeInvoice = true;
    }
}