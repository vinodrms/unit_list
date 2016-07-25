import {Component, OnInit, Input} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {AppContext, ThError} from '../../../../../../../../../../../../../common/utils/AppContext';
import {EditSaveButtonGroupComponent} from '../../../../../../../../../../../../../common/utils/components/button-groups/EditSaveButtonGroupComponent';
import {ThDateIntervalPickerComponent} from '../../../../../../../../../../../../../common/utils/components/ThDateIntervalPickerComponent';
import {ThDatePickerComponent} from '../../../../../../../../../../../../../common/utils/components/ThDatePickerComponent';
import {ThDateIntervalDO} from '../../../../../../../../../../../services/common/data-objects/th-dates/ThDateIntervalDO';
import {ThDateDO} from '../../../../../../../../../../../services/common/data-objects/th-dates/ThDateDO';
import {ThDateUtils} from '../../../../../../../../../../../services/common/data-objects/th-dates/ThDateUtils';
import {BookingOperationsPageData} from '../../services/utils/BookingOperationsPageData';
import {BookingIntervalEditRight} from '../../../../../../../../../../../services/bookings/data-objects/BookingEditRights';
import {BookingDO} from '../../../../../../../../../../../services/bookings/data-objects/BookingDO';

@Component({
    selector: 'booking-period-editor',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/booking-operations/components/period-editor/template/booking-period-editor.html',
    directives: [EditSaveButtonGroupComponent, ThDateIntervalPickerComponent, ThDatePickerComponent],
    pipes: [TranslationPipe]
})
export class BookingPeriodEditorComponent implements OnInit {
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

    constructor(private _appContext: AppContext) { }

    ngOnInit() {
        this._didInit = true;
        this.loadDependentData();
    }

    private loadDependentData() {
        if (!this._didInit || this._appContext.thUtils.isUndefinedOrNull(this._bookingOperationsPageData)) { return; }
        this.readonly = true;
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
        return this._bookingOperationsPageData.bookingMeta.intervalEditRight === BookingIntervalEditRight.NoIntervalEdit;
    }
    public get editIntervalAccess(): boolean {
        return this._bookingOperationsPageData.bookingMeta.intervalEditRight === BookingIntervalEditRight.EditInterval;
    }
    public get editEndDateAccess(): boolean {
        return this._bookingOperationsPageData.bookingMeta.intervalEditRight === BookingIntervalEditRight.EditEndDate;
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
        // TODO

    }
}