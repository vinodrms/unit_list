import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';

import { AppContext, ThServerApi } from '../../../../../../common/utils/AppContext';
import { ThDateDO } from '../../../common/data-objects/th-dates/ThDateDO';
import { ARequestService } from '../../../common/ARequestService';
import { DeparturesInfoDO } from './data-objects/DeparturesInfoDO';
import { DepartureItemInfoDO, DepartureItemBookingStatus } from './data-objects/DepartureItemInfoDO';
import { DepartureItemInfoVM } from './view-models/DepartureItemInfoVM';
import { RoomsService } from '../../../rooms/RoomsService';
import { RoomVM } from '../../../rooms/view-models/RoomVM';
import { RoomItemsIndexer } from '../utils/RoomItemsIndexer';
import { HotelAggregatorService } from '../../../hotel/HotelAggregatorService';
import { HotelAggregatedInfo } from '../../../hotel/utils/HotelAggregatedInfo';
import { RoomCategoriesStatsService } from '../../../room-categories/RoomCategoriesStatsService';
import { RoomCategoryStatsDO } from '../../../room-categories/data-objects/RoomCategoryStatsDO';

import { ThTranslation } from '../../../../../../common/utils/localization/ThTranslation';
import { DepartureItemContainer } from "./utils/DepartureItemContainer";

@Injectable()
export class HotelOperationsDashboardDeparturesService extends ARequestService<DepartureItemInfoVM[]> {
    private _referenceDate: ThDateDO;

    constructor(
        private _appContext: AppContext,
        private _roomsService: RoomsService,
        private _hotelAggregatorService: HotelAggregatorService,
        private _roomCategoriesStatsService: RoomCategoriesStatsService,
        private _thTranslation: ThTranslation
    ) {
        super();
    }

    protected sendRequest(): Observable<Object> {
        return Observable.combineLatest(
            this._roomsService.getRoomList(),
            this._hotelAggregatorService.getHotelAggregatedInfo(),
            this._roomCategoriesStatsService.getRoomCategoryStatsForRoomCategoryIdList(),
            this._appContext.thHttp.post({
                serverApi: ThServerApi.HotelOperationsDashboardDepartures,
                body: JSON.stringify({
                    query: { referenceDate: this._referenceDate }
                })
            })
        ).map((result: [RoomVM[], HotelAggregatedInfo, RoomCategoryStatsDO[], Object]) => {
            var roomVMList: RoomVM[] = result[0];
            var hotelAggregatedInfo: HotelAggregatedInfo = result[1];
            var roomCategStatsList: RoomCategoryStatsDO[] = result[2];
            var departuresInfoObject = result[3];
            var roomItemIndexer = new RoomItemsIndexer([], roomVMList);

            var departuresInfo = new DeparturesInfoDO();
            departuresInfo.buildFromObject(departuresInfoObject);

            let departureContainer = new DepartureItemContainer(this._appContext, this._thTranslation,
                departuresInfo.departureInfoList, hotelAggregatedInfo, roomCategStatsList, roomVMList);
            let list = departureContainer.departureItemInfoVMList;

            return list;
        });
    }

    protected parseResult(result: Object): DepartureItemInfoVM[] {
        return <DepartureItemInfoVM[]>result;
    }

    public getDepartureItems(referenceDate?: ThDateDO): Observable<DepartureItemInfoVM[]> {
        this._referenceDate = referenceDate;
        return this.getServiceObservable();
    }

    public refresh(referenceDate?: ThDateDO) {
        if (!this._appContext.thUtils.isUndefinedOrNull(referenceDate)) {
            this._referenceDate = referenceDate;
        }
        this.updateServiceResult();
    }

}