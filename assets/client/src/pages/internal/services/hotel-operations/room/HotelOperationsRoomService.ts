import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {AppContext, ThServerApi} from '../../../../../common/utils/AppContext';
import {BookingDO} from '../../bookings/data-objects/BookingDO';
import {AssignRoomParam} from './utils/AssignRoomParam';
import {CheckOutRoomParam} from './utils/CheckOutRoomParam';
import {RoomDO} from '../../rooms/data-objects/RoomDO';

@Injectable()
export class HotelOperationsRoomService {

    constructor(private _appContext: AppContext) {
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
    public updateMaintenanceStatus(room: RoomDO): Observable<RoomDO> {
        return this._appContext.thHttp.post(ThServerApi.HotelOperationsRoomChangeMaintenanceStatus, { room: room }).map((roomObject: Object) => {
            var roomDO = new RoomDO();
            roomDO.buildFromObject(roomObject["room"]);
            return roomDO;
        });
    }

    private applyRoomChange(roomChangeApi: ThServerApi, postData: Object): Observable<BookingDO> {
        return this._appContext.thHttp.post(roomChangeApi, postData).map((bookingObject: Object) => {
            var bookingDO = new BookingDO();
            bookingDO.buildFromObject(bookingObject["booking"]);
            return bookingDO;
        });
    }
}