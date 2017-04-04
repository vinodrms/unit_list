import {Component} from '@angular/core';
import {AppContext, ThError} from '../../../../../../../../common/utils/AppContext';
import {BaseComponent} from '../../../../../../../../common/base/BaseComponent';
import {ICustomModalComponent, ModalSize} from '../../../../../../../../common/utils/modals/utils/ICustomModalComponent';
import {ModalDialogRef} from '../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {PriceSelectionVM} from './components/price-selection/services/view-models/PriceSelectionVM';
import {BookingDO} from '../../../../../../services/bookings/data-objects/BookingDO';
import {RoomVM} from '../../../../../../services/rooms/view-models/RoomVM';
import {AssignRoomParam} from '../../../../../../services/hotel-operations/room/utils/AssignRoomParam';
import {RoomSelectionComponent} from './components/room-selection/RoomSelectionComponent';
import {PriceSelectionComponent} from './components/price-selection/PriceSelectionComponent';
import {AssignRoomModalInput} from './services/utils/AssignRoomModalInput';

import {SETTINGS_PROVIDERS} from '../../../../../../services/settings/SettingsProviders';
import {BookingOccupancyService} from '../../../../../../services/bookings/occupancy/BookingOccupancyService';
import {HotelService} from '../../../../../../services/hotel/HotelService';
import {HotelAggregatorService} from '../../../../../../services/hotel/HotelAggregatorService';
import {HotelOperationsRoomService} from '../../../../../../services/hotel-operations/room/HotelOperationsRoomService';
import {EagerCustomersService} from '../../../../../../services/customers/EagerCustomersService';
import {RoomCategoriesStatsService} from '../../../../../../services/room-categories/RoomCategoriesStatsService';
import {RoomsService} from '../../../../../../services/rooms/RoomsService';
import {EagerBookingsService} from '../../../../../../services/bookings/EagerBookingsService';
import {RoomMaintenanceStatus} from '../../../../../../services/rooms/data-objects/RoomDO';

@Component({
    selector: 'assign-room-modal',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/assign-room/template/assign-room-modal.html',
    providers: [SETTINGS_PROVIDERS, HotelService, HotelAggregatorService,
        RoomCategoriesStatsService, RoomsService, EagerCustomersService,
        EagerBookingsService, BookingOccupancyService,
        HotelOperationsRoomService]
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
        if (this.selectedRoomVM.room.maintenanceStatus != RoomMaintenanceStatus.Clean) {
            var roomNotCleanWarningString = this._appContext.thTranslation.translate('The room is not clean.');
            var roomNotCleanWarningTitle = this._appContext.thTranslation.translate('Room maintenance warning');
            this._appContext.modalService.confirm(roomNotCleanWarningTitle, roomNotCleanWarningString, { positive: this._appContext.thTranslation.translate("Continue Anyway"), negative: this._appContext.thTranslation.translate("Back") },
                () => {
                    this.assignRoom();
                },
                () => {
                    return;
                });
        } else {
            this.assignRoom();
        }
    }

    public get strategyButtonText(): string {
        return this._modalInput.assignRoomStrategy.getStrategyButtonText();
    }

    private assignRoom() {
        this.isAssigningRoom = true;
        var assignRoomParams: AssignRoomParam = {
            groupBookingId: this._modalInput.assignRoomParam.groupBookingId,
            bookingId: this._modalInput.assignRoomParam.bookingId,
            roomId: this._modalInput.assignRoomParam.roomId,
            roomCategoryId: this.selectedRoomCategoryId
        };
        this._modalInput.assignRoomStrategy.applyStrategy(this._hotelOperationsRoomService, assignRoomParams).subscribe((updatedBooking: BookingDO) => {
            this._appContext.analytics.logEvent("assign-room", this._modalInput.assignRoomStrategy.getEventAction());
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
}