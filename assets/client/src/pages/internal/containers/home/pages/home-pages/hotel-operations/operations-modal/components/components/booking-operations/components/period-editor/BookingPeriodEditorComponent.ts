import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {AppContext, ThError} from '../../../../../../../../../../../../../common/utils/AppContext';
import {ThDateIntervalDO} from '../../../../../../../../../../../services/common/data-objects/th-dates/ThDateIntervalDO';
import {ThDateDO} from '../../../../../../../../../../../services/common/data-objects/th-dates/ThDateDO';
import {ThDateUtils} from '../../../../../../../../../../../services/common/data-objects/th-dates/ThDateUtils';
import {BookingOperationsPageData} from '../../services/utils/BookingOperationsPageData';
import {BookingIntervalEditRight} from '../../../../../../../../../../../services/bookings/data-objects/BookingEditRights';
import {BookingDO} from '../../../../../../../../../../../services/bookings/data-objects/BookingDO';
import {HotelOperationsBookingService} from '../../../../../../../../../../../services/hotel-operations/booking/HotelOperationsBookingService';

@Component({
    selector: 'booking-period-editor',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/booking-operations/components/period-editor/template/booking-period-editor.html'
})
export class BookingPeriodEditorComponent implements OnInit {
    @Output() onBookingPeriodChanged = new EventEmitter<BookingDO>();
    public triggerOnBookingPeriodChanged(updatedBooking: BookingDO) {
        this.onBookingPeriodChanged.next(updatedBooking);
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
    readonly: boolean = true;
    isSaving: boolean = false;
    private _bookingIntervalCopy: ThDateIntervalDO;

    minIntervalStartDate: ThDateDO;
    minIntervalEndDate: ThDateDO;

    constructor(private _appContext: AppContext,
        private _hotelOperationsBookingService: HotelOperationsBookingService) { }

    ngOnInit() {
        this._didInit = true;
        this.loadDependentData();
    }

    private loadDependentData() {
        if (!this._didInit || this._appContext.thUtils.isUndefinedOrNull(this._bookingOperationsPageData)) { return; }
        this.readonly = true;
        this.isSaving = false;
        this.minIntervalStartDate = this._dateUtils.addDaysToThDateDO(this._dateUtils.getTodayThDayeDO(), -1);
        this.minIntervalEndDate = this._dateUtils.addDaysToThDateDO(this.bookingDO.interval.start, 1);
    }

    public get bookingDO(): BookingDO {
        return this._bookingOperationsPageData.bookingDO;
    }
    public get bookingInterval(): ThDateIntervalDO {
        return this.bookingDO.interval;
    }

    public get noIntervalEditAccess(): boolean {
        return this._bookingOperationsPageData.bookingMeta.intervalEditRight === BookingIntervalEditRight.NoIntervalEdit
            || this._bookingOperationsPageData.hasPaidInvoice;
    }
    public get editIntervalAccess(): boolean {
        return this._bookingOperationsPageData.bookingMeta.intervalEditRight === BookingIntervalEditRight.EditInterval
            && !this._bookingOperationsPageData.hasPaidInvoice;;
    }
    public get editEndDateAccess(): boolean {
        return this._bookingOperationsPageData.bookingMeta.intervalEditRight === BookingIntervalEditRight.EditEndDate
            && !this._bookingOperationsPageData.hasPaidInvoice;
    }

    public get startDateLongString(): string {
        return this.bookingDO.interval.start.getLongDisplayString(this._appContext.thTranslation);
    }
    public get endDateLongString(): string {
        return this.bookingDO.interval.end.getLongDisplayString(this._appContext.thTranslation);
    }

    public startEdit() {
        if (this.noIntervalEditAccess) { return; };
        this.readonly = false;
        this._bookingIntervalCopy = this.bookingDO.interval.buildPrototype();
    }
    public endEdit() {
        this.readonly = true;
        this.bookingDO.interval = this._bookingIntervalCopy;
    }
    public didSelectBookingInterval(newBookingInterval: ThDateIntervalDO) {
        this.bookingDO.interval = newBookingInterval;
    }
    public didSelectBookingEndDate(endDate: ThDateDO) {
        this.bookingDO.interval.end = endDate;
    }
    public saveBookingPeriod() {
        if (this._bookingIntervalCopy.isSame(this.bookingDO.interval)) {
            this.endEdit();
            return;
        }
        var title = this._appContext.thTranslation.translate("Change Dates");
        var content = this._appContext.thTranslation.translate("Are you sure you want to change the dates for this booking? The price will be recomputed using thew new period.");
        this._appContext.modalService.confirm(title, content, { positive: this._appContext.thTranslation.translate("Yes"), negative: this._appContext.thTranslation.translate("No") },
            () => {
                this.saveBookingPeriodCore();
            }, () => { });
    }
    private saveBookingPeriodCore() {
        this.isSaving = true;
        this._hotelOperationsBookingService.changeDates(this.bookingDO).subscribe((updatedBooking: BookingDO) => {
            this._appContext.analytics.logEvent("booking", "change-period", "Changed the period for a booking");
            this.readonly = true;
            this.isSaving = false;
            this.triggerOnBookingPeriodChanged(updatedBooking);
        }, (error: ThError) => {
            this.isSaving = false;
            this._appContext.toaster.error(error.message);
        });
    }
}