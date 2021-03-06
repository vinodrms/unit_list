import * as _ from "underscore";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';
import { AppContext } from '../../../../../../../../../../../common/utils/AppContext';
import { ASinglePageRequestService } from '../../../../../../../../../services/common/ASinglePageRequestService';
import { RoomCategoriesStatsService } from '../../../../../../../../../services/room-categories/RoomCategoriesStatsService';
import { RoomCategoryStatsDO } from '../../../../../../../../../services/room-categories/data-objects/RoomCategoryStatsDO';
import { AssignRoomModalInput } from '../../../services/utils/AssignRoomModalInput';
import { EagerBookingsService } from '../../../../../../../../../services/bookings/EagerBookingsService';
import { RoomsService } from '../../../../../../../../../services/rooms/RoomsService';
import { RoomVM } from '../../../../../../../../../services/rooms/view-models/RoomVM';
import { BookingOccupancyService } from '../../../../../../../../../services/bookings/occupancy/BookingOccupancyService';
import { BookingOccupancyDO } from '../../../../../../../../../services/bookings/occupancy/data-objects/BookingOccupancyDO';
import { BookingDO } from '../../../../../../../../../services/bookings/data-objects/BookingDO';
import { BookingsDO } from '../../../../../../../../../services/bookings/data-objects/BookingsDO';
import { AssignableRoomVMContainer } from './view-models/AssignableRoomVMContainer';
import { AssignableRoomVMBuilder } from './view-models/AssignableRoomVMBuilder';
import { AssignableRoomVM } from './view-models/AssignableRoomVM';
import { SortOptions } from "../../../../../../../../../services/common/ILazyLoadRequestService";
import { AssignableRoomVMSorter } from "../utils/AssignableRoomVMSorter";

@Injectable()
export class RoomSelectionService extends ASinglePageRequestService<AssignableRoomVM> {
    private _roomVMList: RoomVM[];
    private _bookingDO: BookingDO;
    private _checkedInBookings: BookingsDO;
    private _bookingRoomCategoryStats: RoomCategoryStatsDO;
    private _assignableRoomVMContainer: AssignableRoomVMContainer;
    private sortOptions: SortOptions;
    private assignableRoomVMSorter: AssignableRoomVMSorter;

    constructor(private _appContext: AppContext,
        private _modalInput: AssignRoomModalInput,
        private _roomCategoriesStatsService: RoomCategoriesStatsService,
        private _eagerBookingsService: EagerBookingsService,
        private _roomsService: RoomsService,
        private _bookingOccupancyService: BookingOccupancyService) {
        super();
        this._assignableRoomVMContainer = new AssignableRoomVMContainer([]);
        this.assignableRoomVMSorter = new AssignableRoomVMSorter();
    }

    protected getPageItemList(): Observable<AssignableRoomVM[]> {
        return new Observable<AssignableRoomVM[]>((serviceObserver: Observer<AssignableRoomVM[]>) => {
            serviceObserver.next(this._assignableRoomVMContainer.assignableRoomVMList);
        });
    }

    public getRoomsWithOccupancyVM(): Observable<AssignableRoomVMContainer> {
        this.sortOptions = null;
        return Observable.combineLatest(
            this._roomsService.getRoomList(),
            this._eagerBookingsService.getBooking(this._modalInput.assignRoomParam.bookingId),
            this._eagerBookingsService.getCheckedInBookings()
        ).flatMap((result: [RoomVM[], BookingDO, BookingsDO]) => {
            this._roomVMList = result[0];
            this._bookingDO = result[1];
            this._checkedInBookings = result[2];

            return Observable.combineLatest(
                this._bookingOccupancyService.getBookingOccupancyFor(this._bookingDO.interval, this._bookingDO.id),
                this._roomCategoriesStatsService.getRoomCategoryStatsForRoomCategoryIdList()
            );
        }).map((result: [BookingOccupancyDO, RoomCategoryStatsDO[]]) => {
            var bookingOccupancyDO = result[0];
            var roomCategoryStatsList = result[1];
            this._bookingRoomCategoryStats = _.find(roomCategoryStatsList, (roomCategoryStats: RoomCategoryStatsDO) => {
                return roomCategoryStats.roomCategory.id === this._bookingDO.roomCategoryId;
            });
            var vmBuilder = new AssignableRoomVMBuilder({
                roomList: this._roomVMList,
                booking: this._bookingDO,
                bookingOccupancy: bookingOccupancyDO,
                checkedInBookings: this._checkedInBookings,
                validateAlreadyCheckedInBooking: this._modalInput.assignRoomStrategy.validateAlreadyCheckedInBooking()
            });
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
    public get checkedInBookings(): BookingsDO {
        return this._checkedInBookings;
    }
    public set checkedInBookings(checkedInBookings: BookingsDO) {
        this._checkedInBookings = checkedInBookings;
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
    public sort(sortOptions: SortOptions) {
        this.sortOptions = sortOptions;
        this.assignableRoomVMContainer.assignableRoomVMList = this.assignableRoomVMSorter.sortRoomsBy(this.assignableRoomVMContainer.assignableRoomVMList, sortOptions);
        this.refreshData();
    }

    public getSortedOptions(): SortOptions {
        return this.sortOptions;
    }
}
