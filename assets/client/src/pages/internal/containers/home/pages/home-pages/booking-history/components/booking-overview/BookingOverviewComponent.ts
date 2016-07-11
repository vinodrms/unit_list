import {Component, Input, Output, EventEmitter} from '@angular/core';
import {AppContext} from '../../../../../../../../../common/utils/AppContext';
import {CustomScroll} from '../../../../../../../../../common/utils/directives/CustomScroll';
import {ConfigCapacityComponent} from '../../../../../../../../../common/utils/components/ConfigCapacityComponent';
import {TranslationPipe} from '../../../../../../../../../common/utils/localization/TranslationPipe';
import {BookingVM} from '../../../../../../../services/bookings/view-models/BookingVM';

@Component({
    selector: 'booking-overview',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/booking-history/components/booking-overview/template/booking-overview.html',
    directives: [CustomScroll, ConfigCapacityComponent],
    pipes: [TranslationPipe]
})
export class BookingOverviewComponent {
    @Output() onEdit = new EventEmitter<BookingVM>();
    public editBooking() {
        this.onEdit.next(this._bookingVM);
    }

    private _bookingVM: BookingVM;
    public get bookingVM(): BookingVM {
        return this._bookingVM;
    }
    @Input()
    public set bookingVM(bookingVM: BookingVM) {
        this._bookingVM = bookingVM;
        this.updateDependentData();
    }

    intervalString: string;
    noOfNights: number;

    constructor(private _appContext: AppContext) {
    }

    private updateDependentData() {
        this.intervalString = this._bookingVM.booking.interval.getLongDisplayString(this._appContext.thTranslation);
        this.noOfNights = this._bookingVM.booking.interval.getNumberOfDays();
    }
}