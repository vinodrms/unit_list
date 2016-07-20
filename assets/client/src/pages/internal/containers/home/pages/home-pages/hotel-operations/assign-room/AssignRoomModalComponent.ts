import {Component} from '@angular/core';
import {AppContext, ThError} from '../../../../../../../../common/utils/AppContext';
import {BaseComponent} from '../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../common/utils/localization/TranslationPipe';
import {ICustomModalComponent, ModalSize} from '../../../../../../../../common/utils/modals/utils/ICustomModalComponent';
import {ModalDialogRef} from '../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {PriceSelectionVM} from './components/price-selection/services/view-models/PriceSelectionVM';
import {HotelOperationsBookingService} from '../../../../../../services/hotel-operations/booking/HotelOperationsBookingService';
import {BookingDO} from '../../../../../../services/bookings/data-objects/BookingDO';
import {RoomsService} from '../../../../../../services/rooms/RoomsService';
import {RoomVM} from '../../../../../../services/rooms/view-models/RoomVM';
import {RoomCategoriesStatsService} from '../../../../../../services/room-categories/RoomCategoriesStatsService';
import {SETTINGS_PROVIDERS} from '../../../../../../services/settings/SettingsProviders';
import {BookingOccupancyService} from '../../../../../../services/bookings/occupancy/BookingOccupancyService';
import {HotelService} from '../../../../../../services/hotel/HotelService';
import {HotelAggregatorService} from '../../../../../../services/hotel/HotelAggregatorService';
import {HotelOperationsRoomService} from '../../../../../../services/hotel-operations/room/HotelOperationsRoomService';
import {AssignRoomParam} from '../../../../../../services/hotel-operations/room/utils/AssignRoomParam';
import {RoomSelectionComponent} from './components/room-selection/RoomSelectionComponent';
import {PriceSelectionComponent} from './components/price-selection/PriceSelectionComponent';
import {AssignRoomModalInput} from './services/utils/AssignRoomModalInput';

@Component({
    selector: 'assign-room-modal',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/assign-room/template/assign-room-modal.html',
    directives: [RoomSelectionComponent, PriceSelectionComponent],
    providers: [SETTINGS_PROVIDERS, HotelService, HotelAggregatorService,
        RoomCategoriesStatsService, RoomsService,
        HotelOperationsBookingService, BookingOccupancyService,
        HotelOperationsRoomService],
    pipes: [TranslationPipe]
})
export class AssignRoomModalComponent extends BaseComponent implements ICustomModalComponent {
    selectedRoomVM: RoomVM;
    selectedRoomCategoryId: string;
    isAssigningRoom: boolean = false;

    constructor(private _appContext: AppContext,
        private _modalDialogRef: ModalDialogRef<BookingDO>,
        private _modalInput: AssignRoomModalInput,
        private _hotelOperationsRoomService: HotelOperationsRoomService) {
        super();
    }

    public closeDialog() {
        this._modalDialogRef.closeForced();
    }
    public isBlocking(): boolean {
        return false;
    }
    public getSize(): ModalSize {
        return ModalSize.Large;
    }

    public updateCurrentSelectedRoom(selectedRoomVM: RoomVM) {
        this.selectedRoomVM = selectedRoomVM;
    }

    public didSelectRoom(): boolean {
        return this._modalInput.didSelectRoom();
    }
    public selectRoom() {
        if (!this.selectedRoomVM) { return; }
        this._modalInput.selectRoom(this.selectedRoomVM.room.id);
    }

    public didChangePriceSelection(priceSelection: PriceSelectionVM) {
        this.selectedRoomCategoryId = priceSelection.roomCategoryStats.roomCategory.id;
    }

    public applyRoomAssign() {
        if (!this._modalInput.didSelectRoom() || !this.selectedRoomCategoryId || this.isAssigningRoom) { return };

        this.isAssigningRoom = true;
        var assignRoomParams: AssignRoomParam = {
            groupBookingId: this._modalInput.assignRoomParam.groupBookingId,
            bookingId: this._modalInput.assignRoomParam.bookingId,
            roomId: this._modalInput.assignRoomParam.roomId,
            roomCategoryId: this.selectedRoomCategoryId
        };
        this._modalInput.assignRoomStrategy.applyStrategy(this._hotelOperationsRoomService, assignRoomParams).subscribe((updatedBooking: BookingDO) => {
            this.isAssigningRoom = false;

            var successResultString = this._appContext.thTranslation.translate(this._modalInput.assignRoomStrategy.getStrategySuccessResultString());
            this._appContext.toaster.success(successResultString);

            this._modalDialogRef.addResult(updatedBooking);
            this._modalDialogRef.closeForced();
        }, (err: ThError) => {
            this.isAssigningRoom = false;
            this._appContext.toaster.error(err.message);
        });
    }

    public get strategyButtonText(): string {
        return this._modalInput.assignRoomStrategy.getStrategyButtonText();
    }
}