import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import { AppContext, ThError } from '../../../../../../../../common/utils/AppContext';
import { BaseComponent } from '../../../../../../../../common/base/BaseComponent';
import { ICustomModalComponent, ModalSize } from '../../../../../../../../common/utils/modals/utils/ICustomModalComponent';
import { ModalDialogRef } from '../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import { PriceSelectionVM } from './components/price-selection/services/view-models/PriceSelectionVM';
import { BookingDO } from '../../../../../../services/bookings/data-objects/BookingDO';
import { RoomVM } from '../../../../../../services/rooms/view-models/RoomVM';
import { AssignRoomParam } from '../../../../../../services/hotel-operations/room/utils/AssignRoomParam';
import { RoomSelectionComponent } from './components/room-selection/RoomSelectionComponent';
import { PriceSelectionComponent } from './components/price-selection/PriceSelectionComponent';
import { AssignRoomModalInput } from './services/utils/AssignRoomModalInput';

import { SETTINGS_PROVIDERS } from '../../../../../../services/settings/SettingsProviders';
import { BookingOccupancyService } from '../../../../../../services/bookings/occupancy/BookingOccupancyService';
import { HotelService } from '../../../../../../services/hotel/HotelService';
import { HotelAggregatorService } from '../../../../../../services/hotel/HotelAggregatorService';
import { HotelOperationsRoomService } from '../../../../../../services/hotel-operations/room/HotelOperationsRoomService';
import { EagerCustomersService } from '../../../../../../services/customers/EagerCustomersService';
import { RoomCategoriesStatsService } from '../../../../../../services/room-categories/RoomCategoriesStatsService';
import { RoomsService } from '../../../../../../services/rooms/RoomsService';
import { EagerBookingsService } from '../../../../../../services/bookings/EagerBookingsService';
import { RoomMaintenanceStatus } from '../../../../../../services/rooms/data-objects/RoomDO';
import { RoomMaintenanceStatusModalService } from '../dashboard/components/rooms-canvas/components/room-card/modal/services/RoomMaintenanceStatusModalService';
import { RoomMaintenanceUtils } from '../../../../../../services/rooms/utils/RoomMaintenanceUtils';
import { PriceSelectionService } from "./components/price-selection/services/PriceSelectionService";
import { HotelOperationsBookingService } from "../../../../../../services/hotel-operations/booking/HotelOperationsBookingService";


@Component({
    selector: 'assign-room-modal',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/assign-room/template/assign-room-modal.html',
    providers: [SETTINGS_PROVIDERS, HotelService, HotelAggregatorService,
        RoomCategoriesStatsService, RoomsService, EagerCustomersService,
        EagerBookingsService, BookingOccupancyService,
        HotelOperationsRoomService, RoomMaintenanceStatusModalService,
        HotelOperationsBookingService, PriceSelectionService]
})
export class AssignRoomModalComponent extends BaseComponent implements ICustomModalComponent, OnInit {
    selectedRoomVM: RoomVM;
    selectedRoomCategoryId: string;
    isAssigningRoom: boolean = false;
    isLoading: boolean = false;
    isGettingRoomPrices: boolean = false;
    showPriceSelection: boolean = false;

    private _getRoomByIdSubscription: Subscription;
    private _roomMaintenanceUtils: RoomMaintenanceUtils;

    constructor(private _appContext: AppContext,
        private _modalDialogRef: ModalDialogRef<BookingDO>,
        private _modalInput: AssignRoomModalInput,
        private _hotelOperationsRoomService: HotelOperationsRoomService,
        private _roomsService: RoomsService,
        private _roomMaintenanceStatusModalService: RoomMaintenanceStatusModalService,
        private _priceSelectionService: PriceSelectionService) {
        super();
        this._roomMaintenanceUtils = new RoomMaintenanceUtils();
    }

    ngOnInit() {
        if (this.didSelectRoom()) {
            this.isLoading = true;
            this._roomsService.getRoomById(this._modalInput.assignRoomParam.roomId).subscribe((roomVM: RoomVM) => {
                this.selectedRoomVM = roomVM;
                this.isLoading = false;
            }, (err: ThError) => {
                this._appContext.toaster.error(err.message);
                this.isLoading = false;
            });
        }
    }

    public ngOnDestroy() {
		if (this._getRoomByIdSubscription) {
            this._getRoomByIdSubscription.unsubscribe();
        }
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
        this.selectedRoomCategoryId = null;
        this.selectedRoomVM = selectedRoomVM;
        this._modalInput.selectRoom(this.selectedRoomVM.room.id);
        this.isGettingRoomPrices = true;
        this._priceSelectionService.buildPossiblePrices().subscribe((priceSelectionVMList: PriceSelectionVM[]) => {
            if (priceSelectionVMList.length === 1) {
                this.selectedRoomCategoryId = priceSelectionVMList[0].roomCategoryStats.roomCategory.id;
            }
            this.isGettingRoomPrices = false;
        }, (err: ThError) => {
            this._appContext.toaster.error(err.message);
            this.isGettingRoomPrices = false;
        })

    }

    public didSelectRoom(): boolean {
        return this._modalInput.didSelectRoom();
    }
    public moveToPriceSelection() {
        if (!this.selectedRoomVM) { return; }
        if (!this.selectedRoomCategoryId) {
            this.showPriceSelection = true;
        }
    }

    public didChangePriceSelection(priceSelection: PriceSelectionVM) {
        this.selectedRoomCategoryId = priceSelection.roomCategoryStats.roomCategory.id;
    }

    public applyRoomAssign() {
        if (!this._modalInput.didSelectRoom() || !this.selectedRoomCategoryId || this.isAssigningRoom || !this.selectedRoomVM) { return };
        if (this.selectedRoomVM && this.selectedRoomVM.room.maintenanceStatus != RoomMaintenanceStatus.Clean) {
            var roomNotCleanWarningString = this._appContext.thTranslation.translate('%roomName% is not clean. Are you sure you want to move the booking to this room?', {
                roomName: this.selectedRoomVM.room.name
            });
            var roomNotCleanWarningTitle = this._appContext.thTranslation.translate('Warning');
            this._appContext.modalService.confirm(roomNotCleanWarningTitle, roomNotCleanWarningString, { positive: this._appContext.thTranslation.translate("Yes"), negative: this._appContext.thTranslation.translate("No") },
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
        if (this._appContext.thUtils.isUndefinedOrNull(this._modalInput.oldRoomId)) {
            this.finalizeAssignRoom();
            return;
        }
        if (this._getRoomByIdSubscription) this._getRoomByIdSubscription.unsubscribe();
        this._getRoomByIdSubscription = this._roomsService.getRoomById(this._modalInput.oldRoomId).subscribe((oldRoomVM: RoomVM) => {
            this._roomMaintenanceStatusModalService.openRoomMaintenanceStatusModal(oldRoomVM, this._hotelOperationsRoomService,
            [
                this._roomMaintenanceUtils.getRoomMaintenanceMetaByStatus(RoomMaintenanceStatus.PickUp), 
                this._roomMaintenanceUtils.getRoomMaintenanceMetaByStatus(RoomMaintenanceStatus.Clean),
                this._roomMaintenanceUtils.getRoomMaintenanceMetaByStatus(RoomMaintenanceStatus.Dirty)
            ]).then((modalDialogInstance: ModalDialogRef<boolean>) => {
                    modalDialogInstance.resultObservable.subscribe((changeDone: boolean) => {
                    this.finalizeAssignRoom();
                    this._getRoomByIdSubscription.unsubscribe();
                }, (err: any) => {});
		    }).catch((err: ThError) => {
                this._appContext.toaster.error(err.message);
            });
        }, (err: ThError) => {
            this._appContext.toaster.error(err.message);
        });
    }

    private finalizeAssignRoom() {
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

    private get canAssignRoom(): boolean {
        return this.didSelectRoom() && !this._appContext.thUtils.isUndefinedOrNull(this.selectedRoomCategoryId);
    }
}