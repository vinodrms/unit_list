import {Component} from '@angular/core';
import {ThDateIntervalPickerComponent} from '../../../../../../../../../common/utils/components/ThDateIntervalPickerComponent';
import {BookingsService} from '../../../../../../../services/bookings/BookingsService';
import {ThDateIntervalDO} from '../../../../../../../services/common/data-objects/th-dates/ThDateIntervalDO';

@Component({
    selector: 'bookings-date-filter',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/booking-history/components/bookings-date-filter/template/bookings-date-filter.html'
})
export class BookingsDateFilterComponent {
    searchInterval: ThDateIntervalDO;

    constructor(private _bookingsService: BookingsService) {
        this.searchInterval = this._bookingsService.interval;
    }

    public didSelectSearchInterval(interval: ThDateIntervalDO) {
        this._bookingsService.interval = interval;
    }
}