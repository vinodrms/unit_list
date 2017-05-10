import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppContext, ThError } from '../../../../../../../../../../../../../common/utils/AppContext';
import { BookingOperationsPageData } from '../../services/utils/BookingOperationsPageData';
import { BookingUnreserveRoomRight } from '../../../../../../../../../../../services/bookings/data-objects/BookingEditRights';
import { BookingDO } from '../../../../../../../../../../../services/bookings/data-objects/BookingDO';
import { HotelOperationsRoomService } from "../../../../../../../../../../../services/hotel-operations/room/HotelOperationsRoomService";

@Component({
    selector: 'booking-unreserve-room',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/booking-operations/components/unreserve-room/template/booking-unreserve-room.html'
})
export class BookingUnreserveRoomComponent implements OnInit {
    @Output() onBookingUnreserveRoom = new EventEmitter<BookingDO>();
    public triggerOnBookingUnreserveRoom(updatedBooking: BookingDO) {
        this.onBookingUnreserveRoom.next(updatedBooking);
    }

    private _bookingOperationsPageData: BookingOperationsPageData;
    public get bookingOperationsPageData(): BookingOperationsPageData {
        return this._bookingOperationsPageData;
    }
    @Input()
    public set bookingOperationsPageData(bookingOperationsPageData: BookingOperationsPageData) {
        this._bookingOperationsPageData = bookingOperationsPageData;
        this.loadDependentData();
    }

    private _didInit: boolean = false;
    isSaving: boolean = false;

    constructor(private appContext: AppContext,
        private hotelOperationsRoomService: HotelOperationsRoomService) { }

    ngOnInit() {
        this._didInit = true;
        this.loadDependentData();
    }

    private loadDependentData() {
        if (!this._didInit || this.appContext.thUtils.isUndefinedOrNull(this._bookingOperationsPageData)) { return; }
    }

    public get hasUnreserveRoomRight(): boolean {
        return this._bookingOperationsPageData.bookingMeta.unreserveRoomRight === BookingUnreserveRoomRight.Allowed
            && this._bookingOperationsPageData.hasRoom;
    }

    public unreserveRoom() {
        if (!this.hasUnreserveRoomRight || this.isSaving) { return; }
        var title = this.appContext.thTranslation.translate("Unreserve Room");
        var content = this.appContext.thTranslation.translate("Are you sure you want to unreserve %room% for this booking?", { room: this._bookingOperationsPageData.roomVM.room.name });
        this.appContext.modalService.confirm(title, content, { positive: this.appContext.thTranslation.translate("Yes"), negative: this.appContext.thTranslation.translate("No") },
            () => {
                this.unreserveRoomCore();
            }, () => { });
    }
    private unreserveRoomCore() {
        this.isSaving = true;
        this.hotelOperationsRoomService.unreserveRoom({
            bookingId: this._bookingOperationsPageData.bookingDO.id,
            groupBookingId: this._bookingOperationsPageData.bookingDO.groupBookingId
        }).subscribe((updatedBooking: BookingDO) => {
            this.appContext.analytics.logEvent("booking", "unreserve-room", "Did unreserve a room");
            this.isSaving = false;
            this.triggerOnBookingUnreserveRoom(updatedBooking);
        }, (error: ThError) => {
            this.isSaving = false;
            this.appContext.toaster.error(error.message);
        });
    }
}