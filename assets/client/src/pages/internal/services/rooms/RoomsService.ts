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
import {RoomCategoriesService} from '../room-categories/RoomCategoriesService';
import {RoomCategoryDO} from '../room-categories/data-objects/RoomCategoryDO';
import {RoomAmenitiesService} from '../settings/RoomAmenitiesService';
import {RoomAttributesService} from '../settings/RoomAttributesService';
import {BedsService} from '../beds/BedsService';
import {BedsEagerService} from '../beds/BedsEagerService';
import {AmenityDO} from '../common/data-objects/amenity/AmenityDO';
import {RoomAttributeDO} from '../common/data-objects/room-attribute/RoomAttributeDO';
import {BedsDO} from '../beds/data-objects/BedsDO';
import {BedDO} from '../beds/data-objects/BedDO';
import {BedVM} from '../beds/view-models/BedVM';

@Injectable()
export class RoomsService extends ALazyLoadRequestService<RoomVM> {
    constructor(appContext: AppContext, private _roomCategoriesService: RoomCategoriesService,
        private _roomAmenitiesService: RoomAmenitiesService, private _roomAttributesService: RoomAttributesService,
        private _bedsEagerService: BedsEagerService) {
		super(appContext, ThServerApi.RoomsCount, ThServerApi.Rooms);
	}
    
    protected parsePageDataCore(pageDataObject: Object): Observable<RoomVM[]> {
		return Observable.combineLatest(
            this._roomAmenitiesService.getRoomAmenitiesDO(),
            this._roomAttributesService.getRoomAttributesDO(),
            this._roomCategoriesService.getRoomCategoryList(),
            this._bedsEagerService.getBedAggregatedList()
        ).map((result: [RoomAmenitiesDO, RoomAttributesDO, RoomCategoryDO[], BedVM[]]) => {
            var roomAmenities = result[0];
            var roomAttributes = result[1];
            var roomCategories = result[2];
            var bedVMList = result[3];
            
            var rooms = new RoomsDO();
            rooms.buildFromObject(pageDataObject);
            
            var roomVMList: RoomVM[] = [];
            
            _.forEach(rooms.roomList, (room: RoomDO) => {
                var roomVM = new RoomVM();
                roomVM.room = room;
                
                roomVM.category = _.find(roomCategories, (roomCategory: RoomCategoryDO) => {
                    return roomCategory.id === room.categoryId;    
                });
                
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
                
                roomVM.bedList = [];
                _.forEach(room.bedIdList, (bedId: string) => {
                    var bed = _.find(bedVMList, (bedVM: BedVM) => {
                        return bedVM.bed.id === bedId;    
                    });
                    if(!this._appContext.thUtils.isUndefinedOrNull(bed)) {
                        roomVM.bedList.push(bed);    
                    }
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
        this._roomCategoriesService.refreshData();
    }
}