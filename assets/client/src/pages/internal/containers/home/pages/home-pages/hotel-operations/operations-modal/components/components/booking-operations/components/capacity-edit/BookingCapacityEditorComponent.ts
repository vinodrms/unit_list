import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {AppContext, ThError} from '../../../../../../../../../../../../../common/utils/AppContext';
import {EditSaveButtonGroupComponent} from '../../../../../../../../../../../../../common/utils/components/button-groups/EditSaveButtonGroupComponent';
import {ConfigCapacityComponent} from '../../../../../../../../../../../../../common/utils/components/ConfigCapacityComponent';
import {BookingOperationsPageData} from '../../services/utils/BookingOperationsPageData';
import {HotelOperationsBookingService} from '../../../../../../../../../../../services/hotel-operations/booking/HotelOperationsBookingService';
import {BookingCapacityEditRight} from '../../../../../../../../../../../services/bookings/data-objects/BookingEditRights';
import {BookingDO} from '../../../../../../../../../../../services/bookings/data-objects/BookingDO';
import {ConfigCapacityDO} from '../../../../../../../../../../../services/common/data-objects/bed-config/ConfigCapacityDO';

@Component({
    selector: 'booking-capacity-editor',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/booking-operations/components/capacity-edit/template/booking-capacity-editor.html',
    directives: [EditSaveButtonGroupComponent, ConfigCapacityComponent],
    pipes: [TranslationPipe]
})
export class BookingCapacityEditorComponent implements OnInit {
    @Output() onBookingCapacityChanged = new EventEmitter<BookingDO>();
    public triggerOnBookingCapacityChanged(updatedBooking: BookingDO) {
        this.onBookingCapacityChanged.next(updatedBooking);
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
    readonly: boolean = true;
    isSaving: boolean = false;

    private _bookingCapacityCopy: ConfigCapacityDO;

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
    }

    public get bookingCapacity(): ConfigCapacityDO {
        return this._bookingOperationsPageData.bookingDO.configCapacity;
    }
    public get canEditCapacity(): boolean {
        return this._bookingOperationsPageData.bookingMeta.capacityEditRight === BookingCapacityEditRight.EditCapacity;
    }


    public startEdit() {
        if (!this.canEditCapacity) { return; };
        this.readonly = false;
        this._bookingCapacityCopy = this.bookingCapacity.buildPrototype();
    }
    public endEdit() {
        this.readonly = true;
        this._bookingOperationsPageData.bookingDO.configCapacity = this._bookingCapacityCopy;
    }

    public saveBookingCapacity() {
        if (this._bookingCapacityCopy.isSame(this.bookingCapacity)) {
            this.endEdit();
            return;
        }
        if (!this.bookingCapacity.valid()) { return; }
        var title = this._appContext.thTranslation.translate("Change Capacity");
        var content = this._appContext.thTranslation.translate("Are you sure you want to change the capacity for this booking? This can affect the total price.");
        this._appContext.modalService.confirm(title, content, { positive: this._appContext.thTranslation.translate("Yes"), negative: this._appContext.thTranslation.translate("No") },
            () => {
                this.saveBookingCapacityCore();
            }, () => { });
    }
    private saveBookingCapacityCore() {
        this.isSaving = true;
        this._hotelOperationsBookingService.changeCapacity(this._bookingOperationsPageData.bookingDO).subscribe((updatedBooking: BookingDO) => {
            this.readonly = true;
            this.isSaving = false;
            this.triggerOnBookingCapacityChanged(updatedBooking);
        }, (error: ThError) => {
            this.isSaving = false;
            this._appContext.toaster.error(error.message);
        });
    }
}