import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {AppContext, ThError} from '../../../../../../../../../../../../../common/utils/AppContext';
import {BookingOperationsPageData} from '../../services/utils/BookingOperationsPageData';
import {BookingReactivateRight} from '../../../../../../../../../../../services/bookings/data-objects/BookingEditRights';
import {BookingDO} from '../../../../../../../../../../../services/bookings/data-objects/BookingDO';
import {HotelOperationsBookingService} from '../../../../../../../../../../../services/hotel-operations/booking/HotelOperationsBookingService';

@Component({
    selector: 'booking-reactivate',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/booking-operations/components/reactivate/template/booking-reactivate.html'
})
export class BookingReactivateComponent implements OnInit {
    @Output() onBookingReactivate = new EventEmitter<BookingDO>();
    public triggerOnBookingReactivate(updatedBooking: BookingDO) {
        this.onBookingReactivate.next(updatedBooking);
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

    public get hasReactivateRight(): boolean {
        return this._bookingOperationsPageData.bookingMeta.reactivateRight === BookingReactivateRight.Reactivate;
    }

    public reactivate() {
        if (!this.hasReactivateRight || this.isSaving) { return; }
        var title = this._appContext.thTranslation.translate("Reactivate");
        var content = this._appContext.thTranslation.translate("Are you sure you want to reactivate this booking?");
        this._appContext.modalService.confirm(title, content, { positive: this._appContext.thTranslation.translate("Yes"), negative: this._appContext.thTranslation.translate("No") },
            () => {
                this.reactivateCore();
            }, () => { });
    }
    private reactivateCore() {
        this.isSaving = true;
        this._hotelOperationsBookingService.reactivate(this._bookingOperationsPageData.bookingDO).subscribe((updatedBooking: BookingDO) => {
            this._appContext.analytics.logEvent("booking", "reactivate", "Reactivated a no show booking");
            this.isSaving = false;
            this.triggerOnBookingReactivate(updatedBooking);
        }, (error: ThError) => {
            this.isSaving = false;
            this._appContext.toaster.error(error.message);
        });
    }
}