import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';

import {RoomsService} from '../../../../../../../../../../services/rooms/RoomsService';
import {RoomVM} from '../../../../../../../../../../services/rooms/view-models/RoomVM';
import {HotelOperationsRoomService} from '../../../../../../../../../../services/hotel-operations/room/HotelOperationsRoomService';
import {RoomAttachedBookingResultDO} from '../../../../../../../../../../services/hotel-operations/room/data-objects/RoomAttachedBookingResultDO';
import {BedsEagerService} from '../../../../../../../../../../services/beds/BedsEagerService';
import {BedVM} from '../../../../../../../../../../services/beds/view-models/BedVM';
import {BedVMFilter} from '../../../../../../../../../../services/beds/utils/BedVMFilter';
import {HotelRoomOperationsPageParam} from './utils/HotelRoomOperationsPageParam';
import {RoomOperationsPageData} from './utils/RoomOperationsPageData';

@Injectable()
export class RoomOperationsPageService {

    constructor(private _roomsService: RoomsService,
        private _hotelOperationsRoomService: HotelOperationsRoomService,
        private _bedsEagerService: BedsEagerService) {
    }

    public getPageData(roomOperationsPageParams: HotelRoomOperationsPageParam): Observable<RoomOperationsPageData> {
        return Observable.combineLatest(
            this._roomsService.getRoomById(roomOperationsPageParams.roomId),
            this._bedsEagerService.getBedAggregatedList(),
            this._hotelOperationsRoomService.getAttachedBooking(roomOperationsPageParams.roomId)
        ).map((result: [RoomVM, BedVM[], RoomAttachedBookingResultDO]) => {
            var roomVM: RoomVM = result[0];
            var bedVMList: BedVM[] = result[1];
            var roomAttachedBookingResultDO: RoomAttachedBookingResultDO = result[2];
            var bedVMFilter = new BedVMFilter(bedVMList);
            var filteredBedVMList = bedVMFilter.getFilteredBedsForRoomCategory(result[0].category);
            return new RoomOperationsPageData(roomVM, filteredBedVMList, roomAttachedBookingResultDO);
        });
    }
}