import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';

import {RoomsService} from '../../../../../../../../../../services/rooms/RoomsService';
import {RoomVM} from '../../../../../../../../../../services/rooms/view-models/RoomVM';
import {HotelOperationsRoomService} from '../../../../../../../../../../services/hotel-operations/room/HotelOperationsRoomService';
import {RoomAttachedBookingResultVM} from '../../../../../../../../../../services/hotel-operations/room/view-models/RoomAttachedBookingResultVM';
import {BedsEagerService} from '../../../../../../../../../../services/beds/BedsEagerService';
import {BedVM} from '../../../../../../../../../../services/beds/view-models/BedVM';
import {BedVMFilter} from '../../../../../../../../../../services/beds/utils/BedVMFilter';
import {RoomAmenitiesService} from '../../../../../../../../../../services/settings/RoomAmenitiesService';
import {RoomAttributesService} from '../../../../../../../../../../services/settings/RoomAttributesService';
import {RoomAmenitiesDO} from '../../../../../../../../../../services/settings/data-objects/RoomAmenitiesDO';
import {RoomAttributesDO} from '../../../../../../../../../../services/settings/data-objects/RoomAttributesDO';
import {HotelRoomOperationsPageParam} from './utils/HotelRoomOperationsPageParam';
import {RoomOperationsPageData} from './utils/RoomOperationsPageData';

@Injectable()
export class RoomOperationsPageService {

    constructor(private _roomsService: RoomsService,
        private _hotelOperationsRoomService: HotelOperationsRoomService,
        private _bedsEagerService: BedsEagerService,
        private _roomAmenitiesService: RoomAmenitiesService,
        private _roomAttributesService: RoomAttributesService) {
    }

    public getPageData(roomOperationsPageParams: HotelRoomOperationsPageParam): Observable<RoomOperationsPageData> {
        return Observable.combineLatest(
            this._roomsService.getRoomById(roomOperationsPageParams.roomId),
            this._bedsEagerService.getBedAggregatedList(),
            this._hotelOperationsRoomService.getAttachedBooking(roomOperationsPageParams.roomId),
            this._roomAmenitiesService.getRoomAmenitiesDO(),
            this._roomAttributesService.getRoomAttributesDO()
        ).map((result: [RoomVM, BedVM[], RoomAttachedBookingResultVM, RoomAmenitiesDO, RoomAttributesDO]) => {
            var roomVM: RoomVM = result[0];
            var bedVMList: BedVM[] = result[1];
            var roomAttachedBookingResultVM: RoomAttachedBookingResultVM = result[2];
            var bedVMFilter = new BedVMFilter(bedVMList);
            var filteredBedVMList = bedVMFilter.getFilteredBedsForRoomCategory(result[0].category);

            var roomOperationsData = new RoomOperationsPageData(roomVM, filteredBedVMList, roomAttachedBookingResultVM);
            roomOperationsData.allRoomAmenities = result[3];
            roomOperationsData.allRoomAttributes = result[4];
            return roomOperationsData;
        });
    }
}