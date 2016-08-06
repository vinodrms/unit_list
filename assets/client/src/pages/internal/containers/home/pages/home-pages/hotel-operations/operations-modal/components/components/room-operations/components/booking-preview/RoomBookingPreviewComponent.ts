import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {RoomAttachedBookingResultVM} from '../../../../../../../../../../../services/hotel-operations/room/view-models/RoomAttachedBookingResultVM';
import {AppContext, ThError} from '../../../../../../../../../../../../../common/utils/AppContext';
import {ConfigCapacityComponent} from '../../../../../../../../../../../../../common/utils/components/ConfigCapacityComponent';
import {BookingDO} from '../../../../../../../../../../../services/bookings/data-objects/BookingDO';
import {CustomerDO} from '../../../../../../../../../../../services/customers/data-objects/CustomerDO';
import {HotelOperationsRoomService} from '../../../../../../../../../../../services/hotel-operations/room/HotelOperationsRoomService';
import {HotelOperationsBookingService} from '../../../../../../../../../../../services/hotel-operations/booking/HotelOperationsBookingService';
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

    private _didInit = false;
    isLoading: boolean = false;
    isCheckingOut: boolean = false;
    isRemovingRollawayCapacityWarning: boolean = false;

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
        private _hotelOperationsRoomService: HotelOperationsRoomService,
        private _hotelOperationsBookingService: HotelOperationsBookingService) { }

    ngOnInit() {
        this._didInit = true;
        this.loadDependentData();
    }

    private loadDependentData() {
        if (!this._didInit || this._appContext.thUtils.isUndefinedOrNull(this._roomOperationsPageData)
            || this._appContext.thUtils.isUndefinedOrNull(this._roomOperationsPageData.attachedBookingResultVM)) { return; }
    }

    public get roomAttachedBookingResultVM(): RoomAttachedBookingResultVM {
        return this._roomOperationsPageData.attachedBookingResultVM;
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
    public get needsRollawayBeds(): boolean {
        return _.isBoolean(this.bookingDO.needsRollawayBeds) && this.bookingDO.needsRollawayBeds;
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
            this.isCheckingOut = false;
            this.triggerOnBookingChanged(updatedBooking);
        }, (error: ThError) => {
            this.isCheckingOut = false;
            this._appContext.toaster.error(error.message);
        });
    }

    public markRollawayBeds() {
        if (this.isRemovingRollawayCapacityWarning) { return; }
        var title = this._appContext.thTranslation.translate("Rollaway Beds");
        var content = this._appContext.thTranslation.translate("Are you sure you've added the necessary rollaway beds to fit the booking's capacity?");
        this._appContext.modalService.confirm(title, content, { positive: this._appContext.thTranslation.translate("Yes"), negative: this._appContext.thTranslation.translate("No") },
            () => {
                this.markRollawayBedsCore();
            }, () => { });
    }
    private markRollawayBedsCore() {
        this.isRemovingRollawayCapacityWarning = true;
        this._hotelOperationsBookingService.removeRollawayCapacityWarning(this.bookingDO).subscribe((updatedBooking: BookingDO) => {
            this.isRemovingRollawayCapacityWarning = false;
            this.triggerOnBookingChanged(updatedBooking);
        }, (error: ThError) => {
            this.isRemovingRollawayCapacityWarning = false;
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