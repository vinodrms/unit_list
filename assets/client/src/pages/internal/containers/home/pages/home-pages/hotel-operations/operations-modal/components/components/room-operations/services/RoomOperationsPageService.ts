import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';

import {RoomsService} from '../../../../../../../../../../services/rooms/RoomsService';
import {RoomVM} from '../../../../../../../../../../services/rooms/view-models/RoomVM';
import {HotelOperationsRoomService} from '../../../../../../../../../../services/hotel-operations/room/HotelOperationsRoomService';
import {RoomAttachedBookingResultDO} from '../../../../../../../../../../services/hotel-operations/room/data-objects/RoomAttachedBookingResultDO';
import {HotelRoomOperationsPageParam} from './utils/HotelRoomOperationsPageParam';
import {RoomOperationsPageData} from './utils/RoomOperationsPageData';

@Injectable()
export class RoomOperationsPageService {

    constructor(private _roomsService: RoomsService,
        private _hotelOperationsRoomService: HotelOperationsRoomService) {
    }

    public getPageData(roomOperationsPageParams: HotelRoomOperationsPageParam): Observable<RoomOperationsPageData> {
        return Observable.combineLatest(
            this._roomsService.getRoomById(roomOperationsPageParams.roomId),
            this._hotelOperationsRoomService.getAttachedBooking(roomOperationsPageParams.roomId)
        ).map((result: [RoomVM, RoomAttachedBookingResultDO]) => {
            return new RoomOperationsPageData(result[0], result[1]);
        });
    }
}