import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {ThDateIntervalPipe} from '../../../../../../../../../../../../../common/utils/pipes/ThDateIntervalPipe';
import {AppContext, ThError} from '../../../../../../../../../../../../../common/utils/AppContext';
import {BookingOperationsPageData} from '../../services/utils/BookingOperationsPageData';
import {BookingDO} from '../../../../../../../../../../../services/bookings/data-objects/BookingDO';
import {AllotmentDO, AllotmentStatus} from '../../../../../../../../../../../services/allotments/data-objects/AllotmentDO';

@Component({
    selector: 'booking-allotment-viewer',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/booking-operations/components/allotment-view/template/booking-allotment-viewer.html',
    pipes: [TranslationPipe, ThDateIntervalPipe]
})
export class BookingAllotmentViewerComponent implements OnInit {
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

    hasAllotment: boolean = false;
    constraintsString: string = "";

    constructor(private _appContext: AppContext) { }

    ngOnInit() {
        this._didInit = true;
        this.loadDependentData();
    }

    private loadDependentData() {
        if (!this._didInit || this._appContext.thUtils.isUndefinedOrNull(this._bookingOperationsPageData)) { return; }
        this.hasAllotment = this._bookingOperationsPageData.bookingDO.isMadeThroughAllotment()
            && !this._appContext.thUtils.isUndefinedOrNull(this.allotmentDO)
            && !this._appContext.thUtils.isUndefinedOrNull(this.allotmentDO.id);
        if (!this.hasAllotment) {
            return;
        }
        this.constraintsString = this.allotmentDO.constraints.getBriefValueDisplayString(this._appContext.thTranslation);
    }

    public get allotmentDO(): AllotmentDO {
        return this._bookingOperationsPageData.allotmentDO;
    }
    public get isArchived(): boolean {
        return this.allotmentDO.status == AllotmentStatus.Archived;
    }
}