import * as _ from "underscore";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';

import { ThTranslation } from '../../../../../../common/utils/localization/ThTranslation';
import { AppContext, ThServerApi } from '../../../../../../common/utils/AppContext';
import { ThDateDO } from '../../../common/data-objects/th-dates/ThDateDO';
import { ARequestService } from '../../../common/ARequestService';
import { RoomItemInfoDO, RoomItemStatus } from './data-objects/RoomItemInfoDO';
import { RoomsInfoDO } from './data-objects/RoomsInfoDO';
import { RoomItemInfoVM } from './view-models/RoomItemInfoVM';
import { RoomsService } from '../../../rooms/RoomsService';
import { RoomVM } from '../../../rooms/view-models/RoomVM';
import { RoomDO } from '../../../rooms/data-objects/RoomDO';
import { HotelAggregatorService } from "../../../hotel/HotelAggregatorService";
import { HotelAggregatedInfo } from "../../../hotel/utils/HotelAggregatedInfo";

export class RoomsInfoVM {
    public roomList: RoomItemInfoVM[];
    public totalOccupiedRooms: number;
    public totalInHouseGuests: number;
}


@Injectable()
export class HotelOperationsDashboardRoomsService extends ARequestService<RoomsInfoVM> {
    constructor(
        private appContext: AppContext,
        private roomsService: RoomsService,
        private thTranslation: ThTranslation,
        private hotelAggregatorService: HotelAggregatorService,
    ) {
        super();
    }

    protected sendRequest(): Observable<Object> {
        return Observable.combineLatest(
            this.roomsService.getRoomList(),
            this.appContext.thHttp.post({
                serverApi: ThServerApi.HotelOperationsDashboardRooms
            }),
            this.hotelAggregatorService.getHotelAggregatedInfo(),
        ).map((result: [RoomVM[], Object, HotelAggregatedInfo]) => {
            var roomVMList: RoomVM[] = result[0];
            var roomsInfoObject = result[1];
            var hotelAggregatedInfo: HotelAggregatedInfo = result[2];
            var roomsInfo = new RoomsInfoDO();
            roomsInfo.buildFromObject(roomsInfoObject);

            var roomItemInfoVMList: RoomItemInfoVM[] = [];
            _.forEach(roomVMList, (roomVM: RoomVM) => {
                var roomItemInfoVM = new RoomItemInfoVM(this.thTranslation);
                roomItemInfoVM.roomVM = roomVM;

                var roomItemDO: RoomItemInfoDO = roomsInfo.getRoomItemInfoDOByRoomId(roomVM.room.id);
                if (this.appContext.thUtils.isUndefinedOrNull(roomItemDO)) {
                    roomItemDO = new RoomItemInfoDO();
                    roomItemDO.roomId = roomVM.room.id;
                    roomItemDO.roomStatus = RoomItemStatus.Free;
                }
                roomItemInfoVM.roomItemDO = roomItemDO;
                roomItemInfoVM.currency = hotelAggregatedInfo.ccy;

                roomItemInfoVMList.push(roomItemInfoVM);
            });
            var roomsInfoVM = new RoomsInfoVM();
            roomsInfoVM.roomList = roomItemInfoVMList;
            roomsInfoVM.totalOccupiedRooms = roomsInfo.totalOccupiedRooms;
            roomsInfoVM.totalInHouseGuests = roomsInfo.totalInHouseGuests;
            return roomsInfoVM;
        });
    }

    protected parseResult(result: Object): RoomsInfoVM {
        return <RoomsInfoVM>result;
    }

    public getRoomItems(): Observable<RoomsInfoVM> {
        return this.getServiceObservable().map((roomsInfoVM: RoomsInfoVM) => {
            roomsInfoVM.roomList = roomsInfoVM.roomList.sort((firstItem: RoomItemInfoVM, secondItem: RoomItemInfoVM) => {
                if (firstItem.roomVM.room.floor === secondItem.roomVM.room.floor) {
                    return this.compareRoomNames(firstItem.roomVM.room, secondItem.roomVM.room);
                }
                return firstItem.roomVM.room.floor - secondItem.roomVM.room.floor;
            });

           return roomsInfoVM;
        });
    }
    /**
     * Most users expect their rooms sorted by the numbers from their names
     */
    private compareRoomNames(r1: RoomDO, r2: RoomDO): number {
        let r1Value = HotelOperationsDashboardRoomsService.getRoomNameNumber(r1.name);
        let r2Value = HotelOperationsDashboardRoomsService.getRoomNameNumber(r2.name);
        if (r1Value != -1 && r2Value != -1) {
            return r1Value > r2Value ? 1 : -1;
        }
        return r1.name > r2.name ? 1 : -1;
    }
    /**
     * Tries to extract the number from the room's name; returns -1 if no number is found.
     * @param roomName The name of the room
     */
    public static getRoomNameNumber(roomName: string): number {
        let roomNameDigits: string = roomName.replace(/\D/g, '');
        if (roomNameDigits.length > 0) {
            let value = parseInt(roomNameDigits);
            if (_.isNumber(value)) {
                return value;
            }
        }
        return -1;
    }

    public refresh() {
        this.updateServiceResult();
    }
}
