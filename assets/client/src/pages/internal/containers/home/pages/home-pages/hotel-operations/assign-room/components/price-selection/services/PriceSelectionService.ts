import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';
import { AppContext } from '../../../../../../../../../../../common/utils/AppContext';
import { ASinglePageRequestService } from '../../../../../../../../../services/common/ASinglePageRequestService';
import { RoomCategoriesStatsService } from '../../../../../../../../../services/room-categories/RoomCategoriesStatsService';
import { RoomCategoryStatsDO } from '../../../../../../../../../services/room-categories/data-objects/RoomCategoryStatsDO';
import { EagerBookingsService } from '../../../../../../../../../services/bookings/EagerBookingsService';
import { RoomsService } from '../../../../../../../../../services/rooms/RoomsService';
import { RoomVM } from '../../../../../../../../../services/rooms/view-models/RoomVM';
import { HotelAggregatorService } from '../../../../../../../../../services/hotel/HotelAggregatorService';
import { HotelAggregatedInfo } from '../../../../../../../../../services/hotel/utils/HotelAggregatedInfo';
import { CurrencyDO } from '../../../../../../../../../services/common/data-objects/currency/CurrencyDO';
import { HotelOperationsBookingService } from '../../../../../../../../../services/hotel-operations/booking/HotelOperationsBookingService';
import { BookingPossiblePriceItemsDO, BookingPriceItemDO } from '../../../../../../../../../services/hotel-operations/booking/data-objects/BookingPossiblePriceItemsDO';
import { AssignRoomModalInput } from '../../../services/utils/AssignRoomModalInput';
import { BookingDO } from '../../../../../../../../../services/bookings/data-objects/BookingDO';
import { PriceSelectionVM } from './view-models/PriceSelectionVM';

import * as _ from "underscore";

export enum PriceSelectionType {
    RoomHasSameRoomCategoryLikeTheBooking,
    RoomHasRoomCategoryInPriceProduct,
    RoomDoesNotHaveRoomCategoryInPriceProduct
}

@Injectable()
export class PriceSelectionService extends ASinglePageRequestService<PriceSelectionVM> {
    private _bookingDO: BookingDO;
    private _bookingRoomCategoryStats: RoomCategoryStatsDO;
    private _roomVM: RoomVM;
    private _priceSelectionType: PriceSelectionType;
    private _priceSelectionList: PriceSelectionVM[];

    constructor(private _appContext: AppContext,
        private _modalInput: AssignRoomModalInput,
        private _roomCategoriesStatsService: RoomCategoriesStatsService,
        private _hotelAggregatorService: HotelAggregatorService,
        private _eagerBookingsService: EagerBookingsService,
        private _roomsService: RoomsService,
        private _operationsBookingService: HotelOperationsBookingService) {
        super();
        this._priceSelectionList = [];
    }
    protected getPageItemList(): Observable<PriceSelectionVM[]> {
        return new Observable<PriceSelectionVM[]>((serviceObserver: Observer<PriceSelectionVM[]>) => {
            serviceObserver.next(this._priceSelectionList);
        });
    }

    public buildPossiblePrices(): Observable<PriceSelectionVM[]> {
        return Observable.combineLatest(
            this._roomCategoriesStatsService.getRoomCategoryStatsForRoomCategoryIdList(),
            this._hotelAggregatorService.getHotelAggregatedInfo(),
            this._roomsService.getRoomList(),
            this._eagerBookingsService.getBooking(this._modalInput.assignRoomParam.groupBookingId, this._modalInput.assignRoomParam.bookingId),
            this._operationsBookingService.getPossiblePrices(this._modalInput.assignRoomParam.groupBookingId, this._modalInput.assignRoomParam.bookingId)
        ).map((result: [RoomCategoryStatsDO[], HotelAggregatedInfo, RoomVM[], BookingDO, BookingPossiblePriceItemsDO]) => {
            var roomCategoryStatsList: RoomCategoryStatsDO[] = result[0];
            var ccy: CurrencyDO = result[1].ccy;
            var roomVMList: RoomVM[] = result[2];

            this._bookingDO = result[3];
            this._bookingRoomCategoryStats = this.getRoomCategoryStatsById(roomCategoryStatsList, this._bookingDO.roomCategoryId);
            this._roomVM = _.find(roomVMList, (roomVM: RoomVM) => { return roomVM.room.id === this._modalInput.assignRoomParam.roomId });
            var possiblePriceItems: BookingPossiblePriceItemsDO = result[4];
            this._priceSelectionList = this.buildPriceSelectionVMList(ccy, roomCategoryStatsList, possiblePriceItems);
            return this._priceSelectionList;
        });
    }
    private getRoomCategoryStatsById(roomCategoryStatsList: RoomCategoryStatsDO[], roomCategoryId: string): RoomCategoryStatsDO {
        return _.find(roomCategoryStatsList, (roomCategoryStats: RoomCategoryStatsDO) => {
            return roomCategoryStats.roomCategory.id === roomCategoryId;
        });
    }

    private buildPriceSelectionVMList(ccy: CurrencyDO, roomCategoryStatsList: RoomCategoryStatsDO[], possiblePriceItems: BookingPossiblePriceItemsDO): PriceSelectionVM[] {
        var priceSelectionVMList: PriceSelectionVM[] = [];
        var priceItemList: BookingPriceItemDO[] = this.buildPriceItems(possiblePriceItems);
        _.forEach(priceItemList, (priceItem: BookingPriceItemDO) => {
            var priceSelectionVM: PriceSelectionVM = new PriceSelectionVM();
            priceSelectionVM.roomCategoryStats = this.getRoomCategoryStatsById(roomCategoryStatsList, priceItem.roomCategoryId);
            priceSelectionVM.price = priceItem.price;
            priceSelectionVM.ccy = ccy;
            priceSelectionVM.description = "";
            if (priceItem.roomCategoryId === this._bookingDO.roomCategoryId) {
                priceSelectionVM.description = this._appContext.thTranslation.translate("Current price from Booking");
            }
            else if (priceItem.roomCategoryId === this._roomVM.categoryStats.roomCategory.id) {
                priceSelectionVM.description = this._appContext.thTranslation.translate("Price for the new room");
            }
            priceSelectionVMList.push(priceSelectionVM);
        });
        return priceSelectionVMList;
    }

    private buildPriceItems(possiblePriceItems: BookingPossiblePriceItemsDO): BookingPriceItemDO[] {
        if (this.roomHasSameRoomCategoryLikeTheBooking()) {
            this._priceSelectionType = PriceSelectionType.RoomHasSameRoomCategoryLikeTheBooking;
            return [possiblePriceItems.getPriceItemFor(this._bookingRoomCategoryStats.roomCategory.id)];
        }
        if (this.roomHasRoomCategoryInPriceProduct(possiblePriceItems)) {
            this._priceSelectionType = PriceSelectionType.RoomHasRoomCategoryInPriceProduct;
            return [
                possiblePriceItems.getPriceItemFor(this._bookingRoomCategoryStats.roomCategory.id),
                possiblePriceItems.getPriceItemFor(this._roomVM.categoryStats.roomCategory.id),
            ];
        }
        this._priceSelectionType = PriceSelectionType.RoomDoesNotHaveRoomCategoryInPriceProduct;
        return possiblePriceItems.priceItemList;
    }
    private roomHasSameRoomCategoryLikeTheBooking(): boolean {
        return this._bookingRoomCategoryStats.roomCategory.id === this._roomVM.categoryStats.roomCategory.id;
    }
    private roomHasRoomCategoryInPriceProduct(possiblePriceItems: BookingPossiblePriceItemsDO): boolean {
        return possiblePriceItems.constrainsPriceFor(this._roomVM.categoryStats.roomCategory.id);
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
    public get roomVM(): RoomVM {
        return this._roomVM;
    }
    public set roomVM(roomVM: RoomVM) {
        this._roomVM = roomVM;
    }
    public get priceSelectionType(): PriceSelectionType {
        return this._priceSelectionType;
    }
    public set priceSelectionType(priceSelectionType: PriceSelectionType) {
        this._priceSelectionType = priceSelectionType;
    }
    public get priceSelectionList(): PriceSelectionVM[] {
        return this._priceSelectionList;
    }
    public set priceSelectionList(priceSelectionList: PriceSelectionVM[]) {
        this._priceSelectionList = priceSelectionList;
    }
}