import {Injectable} from 'angular2/core';
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
import {RoomCategoriesService} from '../room-categories/RoomCategoriesService';
import {RoomCategoryDO} from '../room-categories/data-objects/RoomCategoryDO';
import {RoomAmenitiesService} from '../settings/RoomAmenitiesService';
import {RoomAttributesService} from '../settings/RoomAttributesService';
import {AmenityDO} from '../common/data-objects/amenity/AmenityDO';
import {RoomAttributeDO} from '../common/data-objects/room-attribute/RoomAttributeDO';

@Injectable()
export class RoomsService extends ALazyLoadRequestService<RoomVM> {
    constructor(appContext: AppContext, private _roomCategoriesService: RoomCategoriesService,
        private _roomAmenitiesService: RoomAmenitiesService, private _roomAttributesService: RoomAttributesService) {
		super(appContext, ThServerApi.RoomsCount, ThServerApi.Rooms);
	}
    
    protected parsePageDataCore(pageDataObject: Object): Observable<RoomVM[]> {
		return Observable.combineLatest(
            this._roomAmenitiesService.getRoomAmenitiesDO(),
            this._roomAttributesService.getRoomAttributesDO(),
            this._roomCategoriesService.getRoomCategoryList()
        ).map((result: [RoomAmenitiesDO, RoomAttributesDO, RoomCategoryDO[]]) => {
            var roomAmenities = result[0];
            var roomAttributes = result[1];
            var roomCategories = result[2];
            
            var rooms = new RoomsDO();
            rooms.buildFromObject(rooms);
            
            var roomVMList: RoomVM[] = [];
            _.forEach(rooms.roomList, (room: RoomDO) => {
                var roomVM = new RoomVM();
                roomVM.room = room;
                
                roomVM.category = _.find(roomCategories, (roomCategory: RoomCategoryDO) => {
                    return roomCategory.id === room.categoryId;    
                });
                
                roomVM.roomAmenityList = [];
                _.forEach(room.amenityIdList, (amenityId: string) => {
                    roomVM.roomAmenityList.push(_.find(roomAmenities.roomAmenityList, (roomAmenity: AmenityDO) => {
                        return roomAmenity.id === amenityId;
                    }));        
                });
                
                roomVM.roomAttributeList = [];
                _.forEach(room.attributeIdList, (attributeId: string) => {
                    roomVM.roomAttributeList.push(_.find(roomAttributes.roomAttributeList, (roomAttribute: RoomAttributeDO) => {
                        return roomAttribute.id === attributeId;    
                    }));    
                });
                
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
		return this.runServerPostActionOnBed(ThServerApi.RoomsSaveItem, room);
	}
	public deleteRoomDO(room: RoomDO): Observable<RoomDO> {
		return this.runServerPostActionOnBed(ThServerApi.RoomsDeleteItem, room);
	}

	private runServerPostActionOnBed(apiAction: ThServerApi, room: RoomDO): Observable<RoomDO> {
		return this._appContext.thHttp.post(apiAction, { room: room }).map((roomObject: Object) => {
			this.refreshData();

			var updatedRoomDO: RoomDO = new RoomDO();
			updatedRoomDO.buildFromObject(roomObject["room"]);
			return updatedRoomDO;
		});
	}
}