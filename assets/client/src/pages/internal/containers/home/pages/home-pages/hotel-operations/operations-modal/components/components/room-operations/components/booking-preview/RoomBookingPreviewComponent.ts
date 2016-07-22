import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {RoomAttachedBookingResultVM} from '../../../../../../../../../../../services/hotel-operations/room/view-models/RoomAttachedBookingResultVM';
import {AppContext, ThError} from '../../../../../../../../../../../../../common/utils/AppContext';
import {BookingDO} from '../../../../../../../../../../../services/bookings/data-objects/BookingDO';
import {CustomerDO} from '../../../../../../../../../../../services/customers/data-objects/CustomerDO';
import {HotelOperationsRoomService} from '../../../../../../../../../../../services/hotel-operations/room/HotelOperationsRoomService';
import {CheckOutRoomParam} from '../../../../../../../../../../../services/hotel-operations/room/utils/CheckOutRoomParam';

@Component({
    selector: 'room-booking-preview',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/room-operations/components/booking-preview/template/room-booking-preview.html',
    pipes: [TranslationPipe]
})
export class RoomBookingPreviewComponent implements OnInit {
    @Output() onCheckedOut = new EventEmitter<BookingDO>();
    public triggerOnCheckedOut(updatedBooking: BookingDO) {
        this.onCheckedOut.next(updatedBooking);
    }

    private _didInit = false;
    isLoading: boolean = false;
    isCheckingOut: boolean = false;

    private _attachedBookingResultVM: RoomAttachedBookingResultVM;
    public get attachedBookingResultVM(): RoomAttachedBookingResultVM {
        return this._attachedBookingResultVM;
    }
    @Input()
    public set attachedBookingResultVM(attachedBookingResultVM: RoomAttachedBookingResultVM) {
        this._attachedBookingResultVM = attachedBookingResultVM;
        this.loadDependentData();
    }

    constructor(private _appContext: AppContext,
        private _hotelOperationsRoomService: HotelOperationsRoomService) { }

    ngOnInit() {
        this._didInit = true;
        this.loadDependentData();
    }

    private loadDependentData() {
        if (!this._didInit || this._appContext.thUtils.isUndefinedOrNull(this._attachedBookingResultVM)) { return; }
    }

    public hasNoAttachedBooking(): boolean {
        return this._attachedBookingResultVM.roomAttachedBookingResultDO.hasNoAttachedBooking();
    }

    public hasReservedBooking(): boolean {
        return this._attachedBookingResultVM.roomAttachedBookingResultDO.hasReservedBooking();
    }
    public hasCheckedInBooking(): boolean {
        return this._attachedBookingResultVM.roomAttachedBookingResultDO.hasCheckedInBooking();
    }

    public get bookingDO(): BookingDO {
        return this._attachedBookingResultVM.roomAttachedBookingResultDO.booking;
    }
    public get hasNotes(): boolean {
        return _.isString(this.bookingDO.notes) && this.bookingDO.notes.length > 0;
    }

    public get startDateLongString(): string {
        return this.bookingDO.interval.start.getLongDisplayString(this._appContext.thTranslation);
    }
    public get endDateLongString(): string {
        return this.bookingDO.interval.end.getLongDisplayString(this._appContext.thTranslation);
    }
    public get customer(): CustomerDO {
        return this._attachedBookingResultVM.customersContainer.getCustomerById(this.bookingDO.displayCustomerId);
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
            this.triggerOnCheckedOut(updatedBooking);
        }, (error: ThError) => {
            this.isCheckingOut = false;
            this._appContext.toaster.error(error.message);
        });
    }
}