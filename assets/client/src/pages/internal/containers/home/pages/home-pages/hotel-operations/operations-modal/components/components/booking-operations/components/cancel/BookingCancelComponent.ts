import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {AppContext, ThError} from '../../../../../../../../../../../../../common/utils/AppContext';
import {BookingOperationsPageData} from '../../services/utils/BookingOperationsPageData';
import {BookingCancelRight} from '../../../../../../../../../../../services/bookings/data-objects/BookingEditRights';
import {BookingDO} from '../../../../../../../../../../../services/bookings/data-objects/BookingDO';
import {HotelOperationsBookingService} from '../../../../../../../../../../../services/hotel-operations/booking/HotelOperationsBookingService';

@Component({
    selector: 'booking-cancel',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/booking-operations/components/cancel/template/booking-cancel.html'
})
export class BookingCancelComponent implements OnInit {
    @Output() onBookingCancel = new EventEmitter<BookingDO>();
    public triggerOnBookingCancel(updatedBooking: BookingDO) {
        this.onBookingCancel.next(updatedBooking);
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

    constructor(private _appContext: AppContext,
        private _hotelOperationsBookingService: HotelOperationsBookingService) { }

    ngOnInit() {
        this._didInit = true;
        this.loadDependentData();
    }

    private loadDependentData() {
        if (!this._didInit || this._appContext.thUtils.isUndefinedOrNull(this._bookingOperationsPageData)) { return; }
    }

    public get hasCancelRight(): boolean {
        return this._bookingOperationsPageData.bookingMeta.cancelRight === BookingCancelRight.Cancel;
    }

    public cancel() {
        if (!this.hasCancelRight || this.isSaving) { return; }
        var title = this._appContext.thTranslation.translate("Cancel");
        var content = this._appContext.thTranslation.translate("Are you sure you want to cancel this booking? An invoice with a penalty can be generated depending on the policy set on the price product.");
        this._appContext.modalService.confirm(title, content, { positive: this._appContext.thTranslation.translate("Yes"), negative: this._appContext.thTranslation.translate("No") },
            () => {
                this.cancelCore();
            }, () => { });
    }
    private cancelCore() {
        this.isSaving = true;
        this._hotelOperationsBookingService.cancel(this._bookingOperationsPageData.bookingDO).subscribe((updatedBooking: BookingDO) => {
            this._appContext.analytics.logEvent("booking", "cancel", "Cancelled a booking");
            this.isSaving = false;
            this.triggerOnBookingCancel(updatedBooking);
        }, (error: ThError) => {
            this.isSaving = false;
            this._appContext.toaster.error(error.message);
        });
    }
}