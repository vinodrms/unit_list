import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';

import {AppContext, ThServerApi} from '../../../../common/utils/AppContext';
import {ARequestService} from '../common/ARequestService';
import {RoomsDO} from './data-objects/RoomsDO';
import {RoomVM} from './view-models/RoomVM';
import {RoomAmenitiesDO} from '../settings/data-objects/RoomAmenitiesDO';
import {RoomAttributesDO} from '../settings/data-objects/RoomAttributesDO';
import {RoomCategoriesStatsService} from '../room-categories/RoomCategoriesStatsService';
import {RoomAmenitiesService} from '../settings/RoomAmenitiesService';
import {RoomAttributesService} from '../settings/RoomAttributesService';
import {RoomCategoryStatsDO} from '../room-categories/data-objects/RoomCategoryStatsDO';
import {RoomVMBuilder} from './view-models/RoomVMBuilder';

import * as _ from "underscore";

@Injectable()
export class RoomsService extends ARequestService<RoomVM[]> {

    constructor(private _appContext: AppContext,
        private _roomCategoriesStatsService: RoomCategoriesStatsService, private _roomAmenitiesService: RoomAmenitiesService,
        private _roomAttributesService: RoomAttributesService) {
        super();
    }

    protected sendRequest(): Observable<Object> {
        return Observable.combineLatest(
            this._roomAmenitiesService.getRoomAmenitiesDO(),
            this._roomAttributesService.getRoomAttributesDO(),
            this._roomCategoriesStatsService.getRoomCategoryStatsForRoomCategoryIdList(),
            this._appContext.thHttp.post(ThServerApi.Rooms, {})
        ).map((result: [RoomAmenitiesDO, RoomAttributesDO, RoomCategoryStatsDO[], Object]) => {
            var roomAmenities = result[0];
            var roomAttributes = result[1];
            var roomCategoriesStats = result[2];
            var pageDataObject = result[3];

            var vmBuilder = new RoomVMBuilder(roomAmenities, roomAttributes, roomCategoriesStats);
            return vmBuilder.buildRoomVMListFrom(pageDataObject);
        });
    }

    protected parseResult(result: Object): RoomVM[] {
        return <RoomVM[]>result;
    }

    public getRoomList(): Observable<RoomVM[]> {
        return this.getServiceObservable();
    }
    public getRoomById(roomId: string): Observable<RoomVM> {
        return this.getServiceObservable().map((roomList: RoomVM[]) => {
            return _.find(roomList, (roomVM: RoomVM) => { return roomVM.room.id === roomId });
        });
    }
    public refresh() {
		this.updateServiceResult();
	}
}