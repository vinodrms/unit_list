import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';

import {AppContext, ThServerApi} from '../../../../../../common/utils/AppContext';
import {ThDateDO} from '../../../common/data-objects/th-dates/ThDateDO';
import {ARequestService} from '../../../common/ARequestService';
import {RoomItemInfoDO, RoomItemStatus} from './data-objects/RoomItemInfoDO';
import {RoomsInfoDO} from './data-objects/RoomsInfoDO';
import {RoomItemInfoVM} from './view-models/RoomItemInfoVM';
import {RoomsService} from '../../../rooms/RoomsService';
import {RoomVM} from '../../../rooms/view-models/RoomVM';

import {ThTranslation} from '../../../../../../common/utils/localization/ThTranslation';

@Injectable()
export class HotelOperationsDashboardRoomsService extends ARequestService<RoomItemInfoVM[]> {
    constructor(
        private _appContext: AppContext,
        private _roomsService: RoomsService,
        private _thTranslation: ThTranslation
        ) {
        super();
    }

    protected sendRequest(): Observable<Object> {
        return Observable.combineLatest(
            this._roomsService.getRoomList(),
            this._appContext.thHttp.post(ThServerApi.HotelOperationsDashboardRooms, {})
        ).map((result: [RoomVM[], Object]) => {
            var roomVMList: RoomVM[] = result[0];
            var roomsInfoObject = result[1];

            var roomsInfo = new RoomsInfoDO();
            roomsInfo.buildFromObject(roomsInfoObject);

            var roomItemInfoVMList: RoomItemInfoVM[] = [];
            _.forEach(roomVMList, (roomVM: RoomVM) => {
                var roomItemInfoVM = new RoomItemInfoVM(this._thTranslation);
                roomItemInfoVM.roomVM = roomVM;

                var roomItemDO: RoomItemInfoDO = roomsInfo.getRoomItemInfoDOByRoomId(roomVM.room.id);
                if (this._appContext.thUtils.isUndefinedOrNull(roomItemDO)) {
                    roomItemDO = new RoomItemInfoDO();
                    roomItemDO.roomId = roomVM.room.id;
                    roomItemDO.roomStatus = RoomItemStatus.Free;
                }
                roomItemInfoVM.roomItemDO = roomItemDO;

                roomItemInfoVMList.push(roomItemInfoVM);
            });

            return roomItemInfoVMList;
        });
    }

    protected parseResult(result: Object): RoomItemInfoVM[] {
        return <RoomItemInfoVM[]>result;
    }

    public getRoomItems(): Observable<RoomItemInfoVM[]> {
        return this.getServiceObservable().map((roomItemVMList: RoomItemInfoVM[]) => {
            var sortedRoomItemVMList = roomItemVMList.sort((firstItem: RoomItemInfoVM, secondItem: RoomItemInfoVM) => {
                if (firstItem.roomVM.room.floor === secondItem.roomVM.room.floor) {
                    return (firstItem.roomVM.room.name > secondItem.roomVM.room.name) ? 1 : -1;
                }
                return firstItem.roomVM.room.floor - secondItem.roomVM.room.floor;
            });
            return sortedRoomItemVMList;
        });
    }
    public refresh() {
		this.updateServiceResult();
	}
}