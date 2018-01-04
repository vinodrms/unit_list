import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';
import { AppContext, ThServerApi } from '../../../../../../../../../../../../../../common/utils/AppContext';
import { BookingDotComRoomCategoryConfigurationVM } from '../utils/BookingDotComRoomCategoryConfigurationVM';
import { RoomCategoriesStatsService } from '../../../../../../../../../../../../services/room-categories/RoomCategoriesStatsService';
import { RoomCategoryStatsDO } from '../../../../../../../../../../../../services/room-categories/data-objects/RoomCategoryStatsDO';
import { GetBookingDotComConfigurationService } from '../../../services/GetBookingDotComConfigurationService';
import { BookingDotComConfigurationDO } from '../../../services/utils/BookingDotComConfigurationDO';
import { BookingDotComRoomConfigurationDO } from '../utils/BookingDotComRoomConfigurationDO';
import { ASinglePageRequestService } from '../../../../../../../../../../../../services/common/ASinglePageRequestService';

import _  = require('underscore');
import { Observer } from 'rxjs';

@Injectable()
export class BookingDotComRoomCategoryConfigurationLazyLoadService extends ASinglePageRequestService<BookingDotComRoomCategoryConfigurationVM> {

    private roomCategoryConfiguration: BookingDotComRoomCategoryConfigurationVM[];

    constructor(private appContext: AppContext,
        private roomCategoriesStatsService: RoomCategoriesStatsService, private getBookingDotComConfigurationService: GetBookingDotComConfigurationService) {
        super();
    }

    protected getPageItemList(): Observable<BookingDotComRoomCategoryConfigurationVM[]> {
        return Observable.combineLatest(
            this.roomCategoriesStatsService.getRoomCategoryStatsForRoomCategoryIdList(),
            this.getBookingDotComConfigurationService.getConfiguration()
        ).map((result: [RoomCategoryStatsDO[], BookingDotComConfigurationDO]) => {
            var roomCategoriesStats = result[0];
            var bookingDotComConfiguration = result[1];

            var roomConfigList: BookingDotComRoomCategoryConfigurationVM[] = [];
            _.each(roomCategoriesStats, (roomCategoryStats : RoomCategoryStatsDO) => {
                var roomConfig = new BookingDotComRoomCategoryConfigurationVM();
                roomConfig.roomCategoryStats = roomCategoryStats;
                roomConfig.roomId = this.getBookingDotComRoomId(bookingDotComConfiguration, roomCategoryStats);
                roomConfigList.push(roomConfig);
            });
            return roomConfigList;
        });
    }

    private getBookingDotComRoomId(configuration: BookingDotComConfigurationDO, roomCategoryStatsDO: RoomCategoryStatsDO): string {
        var bookingDotComRoomConfigurationDO: BookingDotComRoomConfigurationDO = _.find(configuration.roomCategoryConfiguration.roomCategoryConfigurations, (roomCategoryConfiguration: BookingDotComRoomConfigurationDO) => {
            return roomCategoryConfiguration.ourRoomCategoryId == roomCategoryStatsDO.roomCategory.id;
        });
        if (!this.appContext.thUtils.isUndefinedOrNull(bookingDotComRoomConfigurationDO)) {
            return bookingDotComRoomConfigurationDO.roomId;
        }
        return "";
    }
}