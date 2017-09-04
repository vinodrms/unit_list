import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';

import { AppContext, ThServerApi } from '../../../../common/utils/AppContext';
import { ALazyLoadRequestService } from '../common/ALazyLoadRequestService';
import { RoomDO } from './data-objects/RoomDO';
import { RoomVM } from './view-models/RoomVM';
import { RoomAmenitiesDO } from '../settings/data-objects/RoomAmenitiesDO';
import { RoomAttributesDO } from '../settings/data-objects/RoomAttributesDO';
import { RoomCategoriesStatsService } from '../room-categories/RoomCategoriesStatsService';
import { RoomAmenitiesService } from '../settings/RoomAmenitiesService';
import { RoomAttributesService } from '../settings/RoomAttributesService';
import { RoomCategoryStatsDO } from '../room-categories/data-objects/RoomCategoryStatsDO';
import { RoomVMBuilder } from './view-models/RoomVMBuilder';

@Injectable()
export class LazyLoadRoomsService extends ALazyLoadRequestService<RoomVM> {
    constructor(appContext: AppContext,
        private _roomCategoriesStatsService: RoomCategoriesStatsService, private _roomAmenitiesService: RoomAmenitiesService,
        private _roomAttributesService: RoomAttributesService) {
        super(appContext, ThServerApi.RoomsCount, ThServerApi.Rooms);
    }

    protected parsePageDataCore(pageDataObject: Object): Observable<RoomVM[]> {
        return Observable.combineLatest(
            this._roomAmenitiesService.getRoomAmenitiesDO(),
            this._roomAttributesService.getRoomAttributesDO(),
            this._roomCategoriesStatsService.getRoomCategoryStatsForRoomCategoryIdList()
        ).map((result: [RoomAmenitiesDO, RoomAttributesDO, RoomCategoryStatsDO[]]) => {
            var roomAmenities = result[0];
            var roomAttributes = result[1];
            var roomCategoriesStats = result[2];

            var vmBuilder = new RoomVMBuilder(roomAmenities, roomAttributes, roomCategoriesStats);
            return vmBuilder.buildRoomVMListFrom(pageDataObject);
        });
    }
    public searchByText(text: string) {
        this.updateSearchCriteria({
            name: text
        });
    }
    public saveRoomDO(room: RoomDO): Observable<RoomDO> {
        return this.runServerPostActionOnRoom(ThServerApi.RoomsSaveItem, room);
    }
    public deleteRoomDO(room: RoomDO): Observable<RoomDO> {
        return this.runServerPostActionOnRoom(ThServerApi.RoomsDeleteItem, room);
    }

    private runServerPostActionOnRoom(apiAction: ThServerApi, room: RoomDO): Observable<RoomDO> {
        return this._appContext.thHttp.post({
            serverApi: apiAction,
            body: JSON.stringify({ 
                room: room 
            })
        }).map((roomObject: Object) => {
            this.runRefreshOnDependencies();
            this.refreshData();

            var updatedRoomDO: RoomDO = new RoomDO();
            updatedRoomDO.buildFromObject(roomObject["room"]);
            return updatedRoomDO;
        });
    }

    private runRefreshOnDependencies() {
        this._roomCategoriesStatsService.refreshData();
    }
}