import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {AppContext, ThServerApi} from '../../../../../common/utils/AppContext';
import {BookingDO} from '../../bookings/data-objects/BookingDO';
import {AssignRoomParam} from './utils/AssignRoomParam';
import {CheckOutRoomParam} from './utils/CheckOutRoomParam';
import {RoomDO} from '../../rooms/data-objects/RoomDO';
import {RoomAttachedBookingResultDO} from './data-objects/RoomAttachedBookingResultDO';
import {ChangeRoomMaintenanceStatusParam} from './utils/ChangeRoomMaintenanceStatusParam';
import {RoomsService} from '../../rooms/RoomsService';

@Injectable()
export class HotelOperationsRoomService {

    constructor(private _appContext: AppContext,
        private _roomsService: RoomsService) {
    }

    public checkIn(assignRoomParam: AssignRoomParam): Observable<BookingDO> {
        return this.applyRoomChange(ThServerApi.HotelOperationsRoomCheckIn, { assignRoom: assignRoomParam });
    }
    public reserveRoom(assignRoomParam: AssignRoomParam): Observable<BookingDO> {
        return this.applyRoomChange(ThServerApi.HotelOperationsRoomReserve, { assignRoom: assignRoomParam });
    }
    public changeRoom(assignRoomParam: AssignRoomParam): Observable<BookingDO> {
        return this.applyRoomChange(ThServerApi.HotelOperationsRoomChange, { assignRoom: assignRoomParam });
    }
    public checkOut(checkOutRoomParam: AssignRoomParam): Observable<BookingDO> {
        return this.applyRoomChange(ThServerApi.HotelOperationsRoomCheckOut, { checkOutRoom: checkOutRoomParam });
    }
    private applyRoomChange(roomChangeApi: ThServerApi, postData: Object): Observable<BookingDO> {
        return this._appContext.thHttp.post(roomChangeApi, postData).map((bookingObject: Object) => {
            var bookingDO = new BookingDO();
            bookingDO.buildFromObject(bookingObject["booking"]);
            return bookingDO;
        });
    }

    public updateMaintenanceStatus(roomMaintenanceStatusParam: ChangeRoomMaintenanceStatusParam): Observable<RoomDO> {
        return this._appContext.thHttp.post(ThServerApi.HotelOperationsRoomChangeMaintenanceStatus, { room: roomMaintenanceStatusParam }).map((roomObject: Object) => {
            this._roomsService.refresh();
            var roomDO = new RoomDO();
            roomDO.buildFromObject(roomObject["room"]);
            return roomDO;
        });
    }

    public getAttachedBooking(roomId: string): Observable<RoomAttachedBookingResultDO> {
        return this._appContext.thHttp.get(ThServerApi.HotelOperationsRoomGetAttachedBooking, { roomId: roomId }).map((resultObject: Object) => {
            var attachedBookingResultDO = new RoomAttachedBookingResultDO();
            attachedBookingResultDO.buildFromObject(resultObject["attachedBookingResult"]);
            return attachedBookingResultDO;
        });
    }
}