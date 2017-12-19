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
import { GetBookingDotComConfigurationService } from '../../../services/GetBookingDotComConfigurationService';
import { BookingDotComConfigurationDO } from '../../../services/utils/BookingDotComConfigurationDO';
import { BookingDotComRoomConfigurationDO } from '../utils/BookingDotComRoomConfigurationDO';

import _  = require('underscore');

@Injectable()
export class BookingDotComRoomConfigurationLazyLoadService extends ALazyLoadRequestService<BookingDotComRoomConfigurationVM> {
    constructor(appContext: AppContext,
        private roomCategoriesStatsService: RoomCategoriesStatsService, private roomAmenitiesService: RoomAmenitiesService,
        private roomAttributesService: RoomAttributesService, private getBookingDotComConfigurationService: GetBookingDotComConfigurationService) {
        super(appContext, ThServerApi.RoomsCount, ThServerApi.Rooms);
    }

    protected parsePageDataCore(pageDataObject: Object): Observable<BookingDotComRoomConfigurationVM[]> {
        return Observable.combineLatest(
            this.roomAmenitiesService.getRoomAmenitiesDO(),
            this.roomAttributesService.getRoomAttributesDO(),
            this.roomCategoriesStatsService.getRoomCategoryStatsForRoomCategoryIdList(),
            this.getBookingDotComConfigurationService.getConfiguration()
        ).map((result: [RoomAmenitiesDO, RoomAttributesDO, RoomCategoryStatsDO[], BookingDotComConfigurationDO]) => {
            var roomAmenities = result[0];
            var roomAttributes = result[1];
            var roomCategoriesStats = result[2];
            var bookingDotComConfiguration = result[3]

            var vmBuilder = new RoomVMBuilder(roomAmenities, roomAttributes, roomCategoriesStats);
            var roomVMList: RoomVM[] =  vmBuilder.buildRoomVMListFrom(pageDataObject);
            var roomConfigList: BookingDotComRoomConfigurationVM[] = [];
            _.each(roomVMList, (roomVM : RoomVM) => {
                var roomConfig = new BookingDotComRoomConfigurationVM();
                roomConfig.roomVM = roomVM;
                roomConfig.roomId = this.getBookingDotComRoomId(bookingDotComConfiguration, roomVM);
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
    private getBookingDotComRoomId(configuration: BookingDotComConfigurationDO, roomVM: RoomVM): string {
        var bookingDotComRoomConfigurationDO: BookingDotComRoomConfigurationDO = _.find(configuration.roomConfiguration.roomConfigurations, (roomConfiguration: BookingDotComRoomConfigurationDO) => {
            return roomConfiguration.ourRoomId == roomVM.room.id;
        });
        if (!this._appContext.thUtils.isUndefinedOrNull(bookingDotComRoomConfigurationDO)) {
            return bookingDotComRoomConfigurationDO.roomId;
        }
        return "";
    }
}