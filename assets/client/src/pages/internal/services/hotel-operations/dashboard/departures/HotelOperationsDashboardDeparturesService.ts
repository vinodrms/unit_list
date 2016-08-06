import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';

import {AppContext, ThServerApi} from '../../../../../../common/utils/AppContext';
import {ThDateDO} from '../../../common/data-objects/th-dates/ThDateDO';
import {ARequestService} from '../../../common/ARequestService';
import {DeparturesInfoDO} from './data-objects/DeparturesInfoDO';
import {DepartureItemInfoDO, DepartureItemBookingStatus} from './data-objects/DepartureItemInfoDO';
import {DepartureItemInfoVM} from './view-models/DepartureItemInfoVM';
import {RoomsService} from '../../../rooms/RoomsService';
import {RoomVM} from '../../../rooms/view-models/RoomVM';
import {RoomItemsIndexer} from '../utils/RoomItemsIndexer';
import {HotelAggregatorService} from '../../../hotel/HotelAggregatorService';
import {HotelAggregatedInfo} from '../../../hotel/utils/HotelAggregatedInfo';
import {RoomCategoriesStatsService} from '../../../room-categories/RoomCategoriesStatsService';
import {RoomCategoryStatsDO} from '../../../room-categories/data-objects/RoomCategoryStatsDO';

import {ThTranslation} from '../../../../../../common/utils/localization/ThTranslation';

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
            this._appContext.thHttp.post(ThServerApi.HotelOperationsDashboardDepartures, { query: { referenceDate: this._referenceDate } })
        ).map((result: [RoomVM[], HotelAggregatedInfo, RoomCategoryStatsDO[], Object]) => {
            var roomVMList: RoomVM[] = result[0];
            var hotelAggregatedInfo: HotelAggregatedInfo = result[1];
            var roomCategStatsList: RoomCategoryStatsDO[] = result[2];
            var departuresInfoObject = result[3];

            var roomItemIndexer = new RoomItemsIndexer([], roomVMList);

            var departuresInfo = new DeparturesInfoDO();
            departuresInfo.buildFromObject(departuresInfoObject);

            var departureItemVMList: DepartureItemInfoVM[] = [];
            _.forEach(departuresInfo.departureInfoList, (departureItemDO: DepartureItemInfoDO) => {
                var departureItemVM = new DepartureItemInfoVM(this._thTranslation);
                departureItemVM.departureItemDO = departureItemDO;
                departureItemVM.hasInvoice = !this._appContext.thUtils.isUndefinedOrNull(departureItemDO.invoiceGroupId);
                departureItemVM.hasBooking = !this._appContext.thUtils.isUndefinedOrNull(departureItemDO.bookingId)
                    && !this._appContext.thUtils.isUndefinedOrNull(departureItemDO.groupBookingId);

                if (departureItemVM.hasBooking) {
                    var attachedRoomVM = roomItemIndexer.getRoomVMById(departureItemDO.roomId);
                    if (!this._appContext.thUtils.isUndefinedOrNull(attachedRoomVM)) {
                        departureItemVM.attachedRoomVM = attachedRoomVM;
                        departureItemVM.hasAttachedRoom = true;
                        departureItemVM.roomCategory = attachedRoomVM.category;
                    }
                    else {
                        var roomCategStats: RoomCategoryStatsDO = _.find(roomCategStatsList, (stat: RoomCategoryStatsDO) => {
                            return stat.roomCategory.id === departureItemDO.roomCategoryId;
                        });
                        if (!this._appContext.thUtils.isUndefinedOrNull(roomCategStats)) {
                            departureItemVM.roomCategory = roomCategStats.roomCategory;
                        }
                    }
                }
                departureItemVM.currency = hotelAggregatedInfo.ccy;
                departureItemVMList.push(departureItemVM);
            });
            return departureItemVMList;
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
        super.refresh();
    }

}