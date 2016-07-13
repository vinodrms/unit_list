import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';

import {AppContext, ThServerApi} from '../../../../common/utils/AppContext';
import {ALazyLoadRequestService} from '../common/ALazyLoadRequestService';
import {RoomsDO} from './data-objects/RoomsDO';
import {RoomDO} from './data-objects/RoomDO';
import {RoomVM} from './view-models/RoomVM';
import {RoomAmenitiesDO} from '../settings/data-objects/RoomAmenitiesDO';
import {RoomAttributesDO} from '../settings/data-objects/RoomAttributesDO';
import {RoomCategoriesStatsService} from '../room-categories/RoomCategoriesStatsService';
import {RoomAmenitiesService} from '../settings/RoomAmenitiesService';
import {RoomAttributesService} from '../settings/RoomAttributesService';
import {AmenityDO} from '../common/data-objects/amenity/AmenityDO';
import {RoomAttributeDO} from '../common/data-objects/room-attribute/RoomAttributeDO';
import {RoomCategoryStatsDO} from '../room-categories/data-objects/RoomCategoryStatsDO';

@Injectable()
export class RoomsService extends ALazyLoadRequestService<RoomVM> {
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
            
            var rooms = new RoomsDO();
            rooms.buildFromObject(pageDataObject);
            
            var roomVMList: RoomVM[] = [];
            _.forEach(rooms.roomList, (room: RoomDO) => {
                var roomVM = new RoomVM();
                roomVM.room = room;

                roomVM.roomAmenityList = [];
                _.forEach(room.amenityIdList, (amenityId: string) => {
                    var roomAmenity = _.find(roomAmenities.roomAmenityList, (roomAmenity: AmenityDO) => {
                        return roomAmenity.id === amenityId;
                    });
                    if(!this._appContext.thUtils.isUndefinedOrNull(roomAmenity)) {
                        roomVM.roomAmenityList.push();        
                    }
                });
                
                roomVM.roomAttributeList = [];
                _.forEach(room.attributeIdList, (attributeId: string) => {
                    var roomAttribute = _.find(roomAttributes.roomAttributeList, (roomAttribute: RoomAttributeDO) => {
                        return roomAttribute.id === attributeId;    
                    });
                    if(!this._appContext.thUtils.isUndefinedOrNull(roomAttribute)) {
                        roomVM.roomAttributeList.push(roomAttribute);    
                    }
                });
                
                roomVM.categoryStats = _.find(roomCategoriesStats, (roomCategoryStats: RoomCategoryStatsDO) => {
                    return roomCategoryStats.roomCategory.id === room.categoryId;    
                });
                
                if(!this._appContext.thUtils.isUndefinedOrNull(roomVM.categoryStats)) {
                    roomVM.category = roomVM.categoryStats.roomCategory;
                }

                roomVMList.push(roomVM);    
            });
            return roomVMList;                 
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
		return this._appContext.thHttp.post(apiAction, { room: room }).map((roomObject: Object) => {
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