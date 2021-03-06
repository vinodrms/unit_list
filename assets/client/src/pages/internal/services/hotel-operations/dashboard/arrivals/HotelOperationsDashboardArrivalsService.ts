import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';

import { AppContext, ThServerApi } from '../../../../../../common/utils/AppContext';
import { ThDateDO } from '../../../common/data-objects/th-dates/ThDateDO';
import { ARequestService } from '../../../common/ARequestService';
import { ArrivalsInfoDO } from './data-objects/ArrivalsInfoDO';
import { ArrivalItemInfoDO } from './data-objects/ArrivalItemInfoDO';
import { ArrivalItemInfoVM } from './view-models/ArrivalItemInfoVM';
import { RoomCategoriesStatsService } from '../../../room-categories/RoomCategoriesStatsService';
import { RoomCategoryStatsDO } from '../../../room-categories/data-objects/RoomCategoryStatsDO';
import { RoomsService } from '../../../rooms/RoomsService';
import { RoomVM } from '../../../rooms/view-models/RoomVM';
import { RoomItemsIndexer } from '../utils/RoomItemsIndexer';

import { ThTranslation } from '../../../../../../common/utils/localization/ThTranslation';

import * as _ from "underscore";


export class ArrivalsInfoVM {
    public arrivalItems: ArrivalItemInfoVM[];
    public totalArrivalsForReferenceDate: number;
}

@Injectable()
export class HotelOperationsDashboardArrivalsService extends ARequestService<ArrivalsInfoVM> {
    private _referenceDate: ThDateDO;

    constructor(
        private _appContext: AppContext,
        private _roomsService: RoomsService,
        private _roomCategoriesStatsService: RoomCategoriesStatsService,
        private _thTranslate: ThTranslation
    ) {
        super();
    }

    protected sendRequest(): Observable<Object> {
        return Observable.combineLatest(
            this._roomCategoriesStatsService.getRoomCategoryStatsForRoomCategoryIdList(),
            this._roomsService.getRoomList(),
            this._appContext.thHttp.post({
                serverApi: ThServerApi.HotelOperationsDashboardArrivals,
                body: JSON.stringify({
                    query: {
                        referenceDate: this._referenceDate
                    }
                })
            })
        ).map((result: [RoomCategoryStatsDO[], RoomVM[], Object]) => {
            var roomCategoriesStatsList: RoomCategoryStatsDO[] = result[0];
            var roomVMList: RoomVM[] = result[1];
            var arrivalsInfoObject = result[2];

            var roomItemIndexer = new RoomItemsIndexer(roomCategoriesStatsList, roomVMList);

            var arrivalsInfo = new ArrivalsInfoDO();
            arrivalsInfo.buildFromObject(arrivalsInfoObject);

            var arrivalItemVMList: ArrivalItemInfoVM[] = [];
            _.forEach(arrivalsInfo.arrivalInfoList, (arrivalItemDO: ArrivalItemInfoDO) => {
                var arrivalItemVM = new ArrivalItemInfoVM(this._thTranslate);
                arrivalItemVM.arrivalItemDO = arrivalItemDO;
                arrivalItemVM.reservedRoomCategoryStats = roomItemIndexer.getRoomCategoryStatsDOById(arrivalItemDO.roomCategoryId);
                arrivalItemVM.hasReservedRoom = false;
                if (!this._appContext.thUtils.isUndefinedOrNull(arrivalItemDO.reservedRoomId)) {
                    var reservedRoomVM = roomItemIndexer.getRoomVMById(arrivalItemDO.reservedRoomId);
                    if (!this._appContext.thUtils.isUndefinedOrNull(reservedRoomVM)) {
                        arrivalItemVM.hasReservedRoom = true;
                        arrivalItemVM.reservedRoomVM = reservedRoomVM;
                    }
                }
                arrivalItemVMList.push(arrivalItemVM);
            });
            var arrivalsInfoVM = new ArrivalsInfoVM();
            arrivalsInfoVM.arrivalItems = arrivalItemVMList;
            arrivalsInfoVM.totalArrivalsForReferenceDate = arrivalsInfo.totalArrivalsForReferenceDate;
            return arrivalsInfoVM;
        });
    }

    protected parseResult(result: Object): ArrivalsInfoVM {
        return <ArrivalsInfoVM>result;
    }

    public getArrivalItems(referenceDate?: ThDateDO): Observable<ArrivalsInfoVM> {
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