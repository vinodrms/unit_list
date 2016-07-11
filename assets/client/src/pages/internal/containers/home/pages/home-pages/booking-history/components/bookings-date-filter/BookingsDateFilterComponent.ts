import {Component} from '@angular/core';
import {ThDateIntervalPickerComponent} from '../../../../../../../../../common/utils/components/ThDateIntervalPickerComponent';
import {BookingsService} from '../../../../../../../services/bookings/BookingsService';

@Component({
    selector: 'bookings-date-filter',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/booking-history/components/bookings-date-filter/template/bookings-date-filter.html',
    directives: [ThDateIntervalPickerComponent]
})
export class BookingsDateFilterComponent {
    constructor(private _bookingsService: BookingsService) { }

}