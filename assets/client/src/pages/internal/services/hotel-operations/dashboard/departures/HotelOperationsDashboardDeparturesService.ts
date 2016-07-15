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

@Injectable()
export class HotelOperationsDashboardDeparturesService extends ARequestService<DepartureItemInfoVM[]> {
    private _referenceDate: ThDateDO;

    constructor(private _appContext: AppContext, private _roomsService: RoomsService) {
        super();
    }

    protected sendRequest(): Observable<Object> {
        return Observable.combineLatest(
            this._roomsService.getRoomList(),
            this._appContext.thHttp.post(ThServerApi.HotelOperationsDashboardDepartures, { query: { referenceDate: this._referenceDate } })
        ).map((result: [RoomVM[], Object]) => {
            var roomVMList: RoomVM[] = result[0];
            var departuresInfoObject = result[1];

            var roomItemIndexer = new RoomItemsIndexer([], roomVMList);

            var departuresInfo = new DeparturesInfoDO();
            departuresInfo.buildFromObject(departuresInfoObject);

            var departureItemVMList: DepartureItemInfoVM[] = [];
            _.forEach(departuresInfo.departureInfoList, (departureItemDO: DepartureItemInfoDO) => {
                var departureItemVM = new DepartureItemInfoVM();
                departureItemVM.departureItemDO = departureItemDO;
                departureItemVM.hasInvoice = !this._appContext.thUtils.isUndefinedOrNull(departureItemDO.invoiceGroupId);
                departureItemVM.hasBooking = !this._appContext.thUtils.isUndefinedOrNull(departureItemDO.bookingId)
                    && !this._appContext.thUtils.isUndefinedOrNull(departureItemDO.groupBookingId);
                departureItemVM.isStayingInRoom = departureItemVM.hasBooking
                    && !this._appContext.thUtils.isUndefinedOrNull(departureItemDO.roomId)
                    && departureItemDO.bookingItemStatus === DepartureItemBookingStatus.CanCheckOut;

                if (departureItemVM.isStayingInRoom) {
                    var stayingRoomVM = roomItemIndexer.getRoomVMById(departureItemDO.roomId);
                    if (!this._appContext.thUtils.isUndefinedOrNull(stayingRoomVM)) {
                        departureItemVM.stayingRoomVM = stayingRoomVM;
                    }
                }
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
}