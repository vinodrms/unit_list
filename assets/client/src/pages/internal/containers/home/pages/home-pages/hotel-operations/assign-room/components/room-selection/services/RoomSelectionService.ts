import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';
import {AppContext} from '../../../../../../../../../../../common/utils/AppContext';
import {ASinglePageRequestService} from '../../../../../../../../../services/common/ASinglePageRequestService';
import {RoomCategoriesStatsService} from '../../../../../../../../../services/room-categories/RoomCategoriesStatsService';
import {RoomCategoryStatsDO} from '../../../../../../../../../services/room-categories/data-objects/RoomCategoryStatsDO';
import {AssignRoomModalInput} from '../../../services/utils/AssignRoomModalInput';
import {EagerBookingsService} from '../../../../../../../../../services/bookings/EagerBookingsService';
import {RoomsService} from '../../../../../../../../../services/rooms/RoomsService';
import {RoomVM} from '../../../../../../../../../services/rooms/view-models/RoomVM';
import {BookingOccupancyService} from '../../../../../../../../../services/bookings/occupancy/BookingOccupancyService';
import {BookingOccupancyDO} from '../../../../../../../../../services/bookings/occupancy/data-objects/BookingOccupancyDO';
import {BookingDO} from '../../../../../../../../../services/bookings/data-objects/BookingDO';
import {AssignableRoomVMContainer} from './view-models/AssignableRoomVMContainer';
import {AssignableRoomVMBuilder} from './view-models/AssignableRoomVMBuilder';
import {AssignableRoomVM} from './view-models/AssignableRoomVM';

@Injectable()
export class RoomSelectionService extends ASinglePageRequestService<AssignableRoomVM> {
    private _roomVMList: RoomVM[];
    private _bookingDO: BookingDO;
    private _bookingRoomCategoryStats: RoomCategoryStatsDO;
    private _assignableRoomVMContainer: AssignableRoomVMContainer;

    constructor(private _appContext: AppContext,
        private _modalInput: AssignRoomModalInput,
        private _roomCategoriesStatsService: RoomCategoriesStatsService,
        private _eagerBookingsService: EagerBookingsService,
        private _roomsService: RoomsService,
        private _bookingOccupancyService: BookingOccupancyService) {
        super();
        this._assignableRoomVMContainer = new AssignableRoomVMContainer([]);
    }

    protected getPageItemList(): Observable<AssignableRoomVM[]> {
        return new Observable<AssignableRoomVM[]>((serviceObserver: Observer<AssignableRoomVM[]>) => {
            serviceObserver.next(this._assignableRoomVMContainer.assignableRoomVMList);
        });
    }

    public getRoomsWithOccupancyVM(): Observable<AssignableRoomVMContainer> {
        return Observable.combineLatest(
            this._roomsService.getRoomList(),
            this._eagerBookingsService.getBooking(this._modalInput.assignRoomParam.groupBookingId, this._modalInput.assignRoomParam.bookingId)
        ).flatMap((result: [RoomVM[], BookingDO]) => {
            this._roomVMList = result[0];
            this._bookingDO = result[1];

            return Observable.combineLatest(
                this._bookingOccupancyService.getBookingOccupancyFor(this._bookingDO.interval, this._bookingDO.bookingId),
                this._roomCategoriesStatsService.getRoomCategoryStatsForRoomCategoryIdList()
            );
        }).map((result: [BookingOccupancyDO, RoomCategoryStatsDO[]]) => {
            var bookingOccupancyDO = result[0];
            var roomCategoryStatsList = result[1];
            this._bookingRoomCategoryStats = _.find(roomCategoryStatsList, (roomCategoryStats: RoomCategoryStatsDO) => {
                return roomCategoryStats.roomCategory.id === this._bookingDO.roomCategoryId;
            });

            var vmBuilder = new AssignableRoomVMBuilder(this._roomVMList, this._bookingDO, bookingOccupancyDO);
            this._assignableRoomVMContainer = vmBuilder.build(this._appContext.thTranslation);
            this._assignableRoomVMContainer.filterRoomCategoryId(this._bookingDO.roomCategoryId);
            return this._assignableRoomVMContainer;
        });
    }

    public get roomVMList(): RoomVM[] {
        return this._roomVMList;
    }
    public set roomVMList(roomVMList: RoomVM[]) {
        this._roomVMList = roomVMList;
    }
    public get bookingDO(): BookingDO {
        return this._bookingDO;
    }
    public set bookingDO(bookingDO: BookingDO) {
        this._bookingDO = bookingDO;
    }
    public get bookingRoomCategoryStats(): RoomCategoryStatsDO {
        return this._bookingRoomCategoryStats;
    }
    public set bookingRoomCategoryStats(bookingRoomCategoryStats: RoomCategoryStatsDO) {
        this._bookingRoomCategoryStats = bookingRoomCategoryStats;
    }
    public get assignableRoomVMContainer(): AssignableRoomVMContainer {
        return this._assignableRoomVMContainer;
    }
    public set assignableRoomVMContainer(asignableRoomVMContainer: AssignableRoomVMContainer) {
        this._assignableRoomVMContainer = asignableRoomVMContainer;
    }
}