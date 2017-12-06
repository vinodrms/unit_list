import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';
import { ALazyLoadRequestService } from '../../../../../../../../../../../../services/common/ALazyLoadRequestService';
import { AppContext, ThServerApi } from '../../../../../../../../../../../../../../common/utils/AppContext';
import { BookingDotComRoomConfigurationVM } from '../utils/BookingDotComRoomConfigurationVM';
import { RoomCategoriesStatsService } from '../../../../../../../../../../../../services/room-categories/RoomCategoriesStatsService';
import { RoomAttributesService } from '../../../../../../../../../../../../services/settings/RoomAttributesService';
import { RoomAmenitiesService } from '../../../../../../../../../../../../services/settings/RoomAmenitiesService';
import { RoomCategoryStatsDO } from '../../../../../../../../../../../../services/room-categories/data-objects/RoomCategoryStatsDO';
import { RoomAttributesDO } from '../../../../../../../../../../../../services/settings/data-objects/RoomAttributesDO';
import { RoomAmenitiesDO } from '../../../../../../../../../../../../services/settings/data-objects/RoomAmenitiesDO';
import { RoomVMBuilder } from '../../../../../../../../../../../../services/rooms/view-models/RoomVMBuilder';
import { RoomVM } from '../../../../../../../../../../../../services/rooms/view-models/RoomVM';


import _  = require('underscore');

@Injectable()
export class BookingDotComRoomConfigurationLazyLoadService extends ALazyLoadRequestService<BookingDotComRoomConfigurationVM> {
    constructor(appContext: AppContext,
        private _roomCategoriesStatsService: RoomCategoriesStatsService, private _roomAmenitiesService: RoomAmenitiesService,
        private _roomAttributesService: RoomAttributesService) {
        super(appContext, ThServerApi.RoomsCount, ThServerApi.Rooms);
    }

    protected parsePageDataCore(pageDataObject: Object): Observable<BookingDotComRoomConfigurationVM[]> {
        return Observable.combineLatest(
            this._roomAmenitiesService.getRoomAmenitiesDO(),
            this._roomAttributesService.getRoomAttributesDO(),
            this._roomCategoriesStatsService.getRoomCategoryStatsForRoomCategoryIdList()
        ).map((result: [RoomAmenitiesDO, RoomAttributesDO, RoomCategoryStatsDO[]]) => {
            var roomAmenities = result[0];
            var roomAttributes = result[1];
            var roomCategoriesStats = result[2];

            var vmBuilder = new RoomVMBuilder(roomAmenities, roomAttributes, roomCategoriesStats);
            var roomVMList: RoomVM[] =  vmBuilder.buildRoomVMListFrom(pageDataObject);
            var roomConfigList: BookingDotComRoomConfigurationVM[] = [];
            _.each(roomVMList, (roomVM : RoomVM) => {
                var roomConfig = new BookingDotComRoomConfigurationVM();
                roomConfig.roomVM = roomVM;
                roomConfig.inventoryCode = "test";
                roomConfigList.push(roomConfig);
            });
            return roomConfigList;
        });
    }
    public searchByText(text: string) {
        this.updateSearchCriteria({
            name: text
        });
    }
}