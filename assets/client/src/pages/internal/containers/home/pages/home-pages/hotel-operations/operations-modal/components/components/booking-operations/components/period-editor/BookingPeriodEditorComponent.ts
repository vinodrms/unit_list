import {Component, OnInit, Input} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {AppContext, ThError} from '../../../../../../../../../../../../../common/utils/AppContext';
import {EditSaveButtonGroupComponent} from '../../../../../../../../../../../../../common/utils/components/button-groups/EditSaveButtonGroupComponent';
import {BookingOperationsPageData} from '../../services/utils/BookingOperationsPageData';
import {BookingIntervalEditRight} from '../../../../../../../../../../../services/bookings/data-objects/BookingEditRights';
import {BookingDO} from '../../../../../../../../../../../services/bookings/data-objects/BookingDO';

@Component({
    selector: 'booking-period-editor',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/booking-operations/components/period-editor/template/booking-period-editor.html',
    directives: [EditSaveButtonGroupComponent],
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

    private _didInit: boolean = false;
    readonly: boolean = true;
    isSaving: boolean = false;

    constructor(private _appContext: AppContext) { }

    ngOnInit() {
        this._didInit = true;
        this.loadDependentData();
    }

    private loadDependentData() {
        if (!this._didInit || this._appContext.thUtils.isUndefinedOrNull(this._bookingOperationsPageData)) { return; }

    }

    public get bookingDO(): BookingDO {
        return this._bookingOperationsPageData.bookingDO;
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
        if (!this.noIntervalEditAccess) { return; };

    }
    public endEdit() {

    }
    public saveBookingPeriod() {

    }
}