import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {ThTimestampPipe} from '../../../../../../../../../../../../../common/utils/pipes/ThTimestampPipe';
import {AppContext, ThError} from '../../../../../../../../../../../../../common/utils/AppContext';
import {EditSaveButtonGroupComponent} from '../../../../../../../../../../../../../common/utils/components/button-groups/EditSaveButtonGroupComponent';
import {BookingOperationsPageData} from '../../services/utils/BookingOperationsPageData';
import {BookingNoShowEditRight} from '../../../../../../../../../../../services/bookings/data-objects/BookingEditRights';
import {BookingDO} from '../../../../../../../../../../../services/bookings/data-objects/BookingDO';
import {HotelOperationsBookingService} from '../../../../../../../../../../../services/hotel-operations/booking/HotelOperationsBookingService';
import {ThTimestampDO} from '../../../../../../../../../../../services/common/data-objects/th-dates/ThTimestampDO';
import {ThDateUtils} from '../../../../../../../../../../../services/common/data-objects/th-dates/ThDateUtils';

@Component({
    selector: 'booking-no-show-editor',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/booking-operations/components/no-show-edit/template/booking-no-show-editor.html',
    directives: [EditSaveButtonGroupComponent],
    pipes: [TranslationPipe, ThTimestampPipe]
})
export class BookingNoShowEditorComponent implements OnInit {
    @Output() onBookingNoShowTimestampChanged = new EventEmitter<BookingDO>();
    public triggerOnBookingNoShowTimestampChanged(updatedBooking: BookingDO) {
        this.onBookingNoShowTimestampChanged.next(updatedBooking);
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

    private _thDateUtils: ThDateUtils;
    private _didInit: boolean = false;
    readonly: boolean = true;
    isSaving: boolean = false;

    noShowTimestamp: ThTimestampDO;
    noShowTimestampList: ThTimestampDO[];
    noShowTimestampCopy: ThTimestampDO;

    constructor(private _appContext: AppContext,
        private _hotelOperationsBookingService: HotelOperationsBookingService) {
        this._thDateUtils = new ThDateUtils();
    }

    ngOnInit() {
        this._didInit = true;
        this.loadDependentData();
    }

    private loadDependentData() {
        if (!this._didInit || this._appContext.thUtils.isUndefinedOrNull(this._bookingOperationsPageData)) { return; }
        this.updateNoShowTimestamp();
        this.readonly = true;
        this.isSaving = false;
    }

    private updateNoShowTimestamp() {
        var noShowTimestamp = this._bookingOperationsPageData.bookingDO.noShowTime.thTimestamp.buildPrototype();
        if (this._bookingOperationsPageData.bookingDO.noShowTime.isDependentOnCancellationHour()) {
            noShowTimestamp.thHourDO = this._bookingOperationsPageData.operationHours.cancellationHour;
        }
        this.noShowTimestamp = noShowTimestamp;
    }

    public get canEditNoShow(): boolean {
        return this._bookingOperationsPageData.bookingMeta.noShowEditRight === BookingNoShowEditRight.EditNoShow;
    }

    public startEdit() {
        if (!this.canEditNoShow) { return; };
        this.buildAvailableNoShowTimestampList();
        this.readonly = false;
        this.noShowTimestampCopy = this.noShowTimestamp.buildPrototype();
    }
    private buildAvailableNoShowTimestampList() {
        this.noShowTimestampList = [this.noShowTimestamp];
        var currentTimestamp = this.noShowTimestamp;
        var maxNoShowTimestamp = this.getMaxNoShowTimestampDO();
        var maxCycles = 50, currentCycle = 0;
        do {
            var currentTimestamp = this._thDateUtils.addThirtyMinutesToThTimestampDO(currentTimestamp);
            this.noShowTimestampList.push(currentTimestamp);
            if (currentTimestamp.isSame(maxNoShowTimestamp)) {
                break;
            }
            currentCycle++;
        } while (currentCycle <= maxCycles);
    }
    private getMaxNoShowTimestampDO(): ThTimestampDO {
        var timestamp = new ThTimestampDO();
        timestamp.thDateDO = this._thDateUtils.addDaysToThDateDO(this._bookingOperationsPageData.bookingDO.interval.start, 1);
        timestamp.thHourDO = this._bookingOperationsPageData.operationHours.checkOutTo;
        return timestamp;
    }

    public endEdit() {
        this.readonly = true;
        this.noShowTimestamp = this.noShowTimestampCopy;
    }
    public didSelectTimestamp(noShowTimestamp: ThTimestampDO) {
        this.noShowTimestamp = noShowTimestamp;
    }
    public saveNoShowTimestamp() {
        if (this.noShowTimestampCopy.isSame(this.noShowTimestamp)) {
            this.endEdit();
            return;
        }
        this.isSaving = true;
        this._hotelOperationsBookingService.changeNoShowTime(this._bookingOperationsPageData.bookingDO, this.noShowTimestamp).subscribe((updatedBooking: BookingDO) => {
            this.readonly = true;
            this.isSaving = false;
            this.triggerOnBookingNoShowTimestampChanged(updatedBooking);
        }, (error: ThError) => {
            this.isSaving = false;
            this._appContext.toaster.error(error.message);
        });
    }
}