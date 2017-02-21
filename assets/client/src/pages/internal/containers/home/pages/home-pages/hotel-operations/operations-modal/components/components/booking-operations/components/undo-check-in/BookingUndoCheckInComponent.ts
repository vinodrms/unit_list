import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppContext, ThError } from '../../../../../../../../../../../../../common/utils/AppContext';
import { ThDateDO } from '../../../../../../../../../../../services/common/data-objects/th-dates/ThDateDO';
import { ThDateUtils } from '../../../../../../../../../../../services/common/data-objects/th-dates/ThDateUtils';
import { BookingOperationsPageData } from '../../services/utils/BookingOperationsPageData';
import { BookingUndoCheckInRight } from '../../../../../../../../../../../services/bookings/data-objects/BookingEditRights';
import { BookingDO } from '../../../../../../../../../../../services/bookings/data-objects/BookingDO';
import { HotelOperationsBookingService } from '../../../../../../../../../../../services/hotel-operations/booking/HotelOperationsBookingService';

@Component({
    selector: 'booking-undo-checkin',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/booking-operations/components/undo-check-in/template/booking-undo-checkin.html'
})
export class BookingUndoCheckInComponent implements OnInit {
    @Output() onBookingUndoCheckIn = new EventEmitter<BookingDO>();
    public triggerOnBookingUndoCheckIn(updatedBooking: BookingDO) {
        this.onBookingUndoCheckIn.next(updatedBooking);
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

    private _dateUtils: ThDateUtils = new ThDateUtils();
    private _didInit: boolean = false;
    isSaving: boolean = false;
    bookingStartDate: ThDateDO;

    constructor(private _appContext: AppContext,
        private _hotelOperationsBookingService: HotelOperationsBookingService) { }

    ngOnInit() {
        this._didInit = true;
        this.loadDependentData();
    }

    private loadDependentData() {
        if (!this._didInit || this._appContext.thUtils.isUndefinedOrNull(this._bookingOperationsPageData)) { return; }
        this.bookingStartDate = this._dateUtils.getTodayThDayeDO();
    }

    public get hasUndoCheckInRight(): boolean {
        return this._bookingOperationsPageData.bookingMeta.undoCheckInRight === BookingUndoCheckInRight.Allowed
            && this.bookingStartDate.isSame(this._bookingOperationsPageData.bookingDO.interval.start)
            && !this._bookingOperationsPageData.hasClosedInvoice;
    }

    public undoCheckIn() {
        if (!this.hasUndoCheckInRight || this.isSaving) { return; }
        var title = this._appContext.thTranslation.translate("Undo Check In");
        var content = this._appContext.thTranslation.translate("Are you sure you want to undo the check in? This will move the booking back to the arrivals pane.");
        this._appContext.modalService.confirm(title, content, { positive: this._appContext.thTranslation.translate("Yes"), negative: this._appContext.thTranslation.translate("No") },
            () => {
                this.undoCheckInCore();
            }, () => { });
    }
    private undoCheckInCore() {
        this.isSaving = true;
        this._hotelOperationsBookingService.undoCheckIn(this._bookingOperationsPageData.bookingDO).subscribe((updatedBooking: BookingDO) => {
            this._appContext.analytics.logEvent("booking", "undo-checkin", "Did undo a check in");
            this.isSaving = false;
            this.triggerOnBookingUndoCheckIn(updatedBooking);
        }, (error: ThError) => {
            this.isSaving = false;
            this._appContext.toaster.error(error.message);
        });
    }
}