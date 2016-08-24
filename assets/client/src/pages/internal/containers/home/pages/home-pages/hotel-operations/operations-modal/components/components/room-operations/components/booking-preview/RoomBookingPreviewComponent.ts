import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {RoomAttachedBookingResultVM} from '../../../../../../../../../../../services/hotel-operations/room/view-models/RoomAttachedBookingResultVM';
import {AppContext, ThError} from '../../../../../../../../../../../../../common/utils/AppContext';
import {ConfigCapacityComponent} from '../../../../../../../../../../../../../common/utils/components/ConfigCapacityComponent';
import {BookingDO} from '../../../../../../../../../../../services/bookings/data-objects/BookingDO';
import {CustomerDO} from '../../../../../../../../../../../services/customers/data-objects/CustomerDO';
import {BedStorageType} from '../../../../../../../../../../../services/beds/data-objects/BedDO';
import {BedVM} from '../../../../../../../../../../../services/beds/view-models/BedVM';
import {RoomDO, RollawayBedStatus} from '../../../../../../../../../../../services/rooms/data-objects/RoomDO';
import {RoomVM} from '../../../../../../../../../../../services/rooms/view-models/RoomVM';
import {HotelOperationsRoomService} from '../../../../../../../../../../../services/hotel-operations/room/HotelOperationsRoomService';
import {CheckOutRoomParam} from '../../../../../../../../../../../services/hotel-operations/room/utils/CheckOutRoomParam';
import {HotelOperationsPageControllerService} from '../../../../services/HotelOperationsPageControllerService';
import {RoomOperationsPageData} from '../../services/utils/RoomOperationsPageData';

@Component({
    selector: 'room-booking-preview',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/room-operations/components/booking-preview/template/room-booking-preview.html',
    directives: [ConfigCapacityComponent],
    pipes: [TranslationPipe]
})
export class RoomBookingPreviewComponent implements OnInit {
    @Output() onBookingChanged = new EventEmitter<BookingDO>();
    public triggerOnBookingChanged(updatedBooking: BookingDO) {
        this.onBookingChanged.next(updatedBooking);
    }

    @Output() onRoomChanged = new EventEmitter<RoomDO>();
    public triggerOnRoomChanged(updatedRoom: RoomDO) {
        this.onRoomChanged.next(updatedRoom);
    }

    private _didInit = false;
    isLoading: boolean = false;
    isCheckingOut: boolean = false;
    isRemovingRollawayCapacityWarning: boolean = false;

    private _roomHasRollawayBeds: boolean = false;
    isUpdatingRollawayBeds: boolean = false;

    private _roomOperationsPageData: RoomOperationsPageData;
    public get roomOperationsPageData(): RoomOperationsPageData {
        return this._roomOperationsPageData;
    }
    @Input()
    public set roomOperationsPageData(roomOperationsPageData: RoomOperationsPageData) {
        this._roomOperationsPageData = roomOperationsPageData;
        this.loadDependentData();
    }

    constructor(private _appContext: AppContext,
        private _operationsPageControllerService: HotelOperationsPageControllerService,
        private _hotelOperationsRoomService: HotelOperationsRoomService) { }

    ngOnInit() {
        this._didInit = true;
        this.loadDependentData();
    }

    private loadDependentData() {
        if (!this._didInit || this._appContext.thUtils.isUndefinedOrNull(this._roomOperationsPageData)
            || this._appContext.thUtils.isUndefinedOrNull(this._roomOperationsPageData.attachedBookingResultVM)) { return; }
        var rollawayBedVMList: BedVM[] = _.filter(this._roomOperationsPageData.bedVMList, (bedVM: BedVM) => { return bedVM.bed.storageType === BedStorageType.Rollaway });
        this._roomHasRollawayBeds = rollawayBedVMList.length > 0;
    }

    public get roomAttachedBookingResultVM(): RoomAttachedBookingResultVM {
        return this._roomOperationsPageData.attachedBookingResultVM;
    }
    public get roomVM(): RoomVM {
        return this._roomOperationsPageData.roomVM;
    }
    public hasNoAttachedBooking(): boolean {
        return this.roomAttachedBookingResultVM.roomAttachedBookingResultDO.hasNoAttachedBooking();
    }
    public hasReservedBooking(): boolean {
        return this.roomAttachedBookingResultVM.roomAttachedBookingResultDO.hasReservedBooking();
    }
    public hasCheckedInBooking(): boolean {
        return this.roomAttachedBookingResultVM.roomAttachedBookingResultDO.hasCheckedInBooking();
    }
    public get bookingTypeString(): string {
        return this.roomAttachedBookingResultVM.roomAttachedBookingResultDO.bookingTypeString;
    }
    public hasUnpaidInvoice(): boolean {
        return this._roomOperationsPageData.hasUnpaidInvoice();
    }
    public viewInvoice() {
        if (!this.hasUnpaidInvoice()) { return; }
        this._operationsPageControllerService.goToInvoice(this._roomOperationsPageData.invoiceGroupDO.id, {
            bookingId: this.roomAttachedBookingResultVM.roomAttachedBookingResultDO.booking.bookingId
        });
    }

    public get bookingDO(): BookingDO {
        return this.roomAttachedBookingResultVM.roomAttachedBookingResultDO.booking;
    }
    public get hasNotes(): boolean {
        return _.isString(this.bookingDO.notes) && this.bookingDO.notes.length > 0;
    }

    public get canAddRollawayBeds(): boolean {
        return this.roomVM.room.rollawayBedStatus === RollawayBedStatus.NoRollawayBeds
            && this._roomHasRollawayBeds;
    }
    public get canRemoveRollawayBeds(): boolean {
        return this.roomVM.room.rollawayBedStatus === RollawayBedStatus.RollawayBedsInside;
    }
    public get requiresAddingRollawayBeds(): boolean {
        return !this.hasNoAttachedBooking() &&
            !this._appContext.thUtils.isUndefinedOrNull(this.bookingDO) &&
            !this.roomVM.categoryStats.capacity.canFitInStationaryCapacity(this.bookingDO.configCapacity) &&
            this.roomVM.room.rollawayBedStatus === RollawayBedStatus.NoRollawayBeds;
    }
    public get rollawayBedStatusString(): string {
        if (this.canRemoveRollawayBeds) {
            return "The rollaway beds are inside the room";
        }
        if (this.canAddRollawayBeds) {
            return "The rollaway beds are not in the room";
        }
        return "The room has no rollaway beds";
    }

    public get startDateLongString(): string {
        return this.bookingDO.interval.start.getLongDisplayString(this._appContext.thTranslation);
    }
    public get endDateLongString(): string {
        return this.bookingDO.interval.end.getLongDisplayString(this._appContext.thTranslation);
    }
    public get customer(): CustomerDO {
        return this.roomAttachedBookingResultVM.customersContainer.getCustomerById(this.bookingDO.displayCustomerId);
    }

    public checkOut() {
        if (!this.hasCheckedInBooking() || this.isCheckingOut) { return; }

        var title = this._appContext.thTranslation.translate("Check Out");
        var content = this._appContext.thTranslation.translate("Are you sure you want to check out this room?");
        this._appContext.modalService.confirm(title, content, { positive: this._appContext.thTranslation.translate("Yes"), negative: this._appContext.thTranslation.translate("No") },
            () => {
                this.checkOutCore();
            }, () => { });
    }
    private checkOutCore() {
        this.isCheckingOut = true;

        var chechOutParams: CheckOutRoomParam = {
            bookingId: this.bookingDO.bookingId,
            groupBookingId: this.bookingDO.groupBookingId
        }
        this._hotelOperationsRoomService.checkOut(chechOutParams).subscribe((updatedBooking: BookingDO) => {
            this._appContext.analytics.logEvent("room", "check-out", "Checked out a room");
            this.isCheckingOut = false;
            this.triggerOnBookingChanged(updatedBooking);
        }, (error: ThError) => {
            this.isCheckingOut = false;
            this._appContext.toaster.error(error.message);
        });
    }

    public addRollawayBeds() {
        this.updateRollawayBedStatus(RollawayBedStatus.RollawayBedsInside,
            "Are you sure you want to add the rollaway beds in the room?",
            "add-rollaway-beds", "Added rollaway beds in a room");
    }
    public removeRollawayBeds() {
        this.updateRollawayBedStatus(RollawayBedStatus.NoRollawayBeds,
            "Are you sure you want to remove the rollaway beds from the room?",
            "remove-rollaway-beds", "Removed rollaway beds from a room");
    }
    public updateRollawayBedStatus(rollawayBedStatus: RollawayBedStatus, alertMsg: string, analyticsAction: string, analyticsDescription: string) {
        if (this.isUpdatingRollawayBeds) { return; }
        var title = this._appContext.thTranslation.translate("Rollaway Beds");
        var content = this._appContext.thTranslation.translate(alertMsg);
        this._appContext.modalService.confirm(title, content, { positive: this._appContext.thTranslation.translate("Yes"), negative: this._appContext.thTranslation.translate("No") },
            () => {
                this.updateRollawayBedStatusCore(rollawayBedStatus, analyticsAction, analyticsDescription);
            }, () => { });
    }
    private updateRollawayBedStatusCore(rollawayBedStatus: RollawayBedStatus, analyticsAction: string, analyticsDescription: string) {
        this.isUpdatingRollawayBeds = true;
        this._hotelOperationsRoomService.updateRollawayBedStatus({
            id: this.roomVM.room.id,
            rollawayBedStatus: rollawayBedStatus
        }).subscribe((updatedRoom: RoomDO) => {
            this._appContext.analytics.logEvent("room", analyticsAction, analyticsDescription);
            this.isUpdatingRollawayBeds = false;
            this.triggerOnRoomChanged(updatedRoom);
        }, (error: ThError) => {
            this.isUpdatingRollawayBeds = false;
            this._appContext.toaster.error(error.message);
        });
    }

    public goToCustomer(customer: CustomerDO) {
        this._operationsPageControllerService.goToCustomer(customer.id);
    }
    public goToBooking(booking: BookingDO) {
        this._operationsPageControllerService.goToBooking(booking.groupBookingId, booking.bookingId);
    }
}