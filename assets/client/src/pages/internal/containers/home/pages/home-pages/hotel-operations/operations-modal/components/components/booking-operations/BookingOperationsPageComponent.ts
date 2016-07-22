import {Component, OnInit, Input} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {LoadingComponent} from '../../../../../../../../../../../common/utils/components/LoadingComponent';
import {CustomScroll} from '../../../../../../../../../../../common/utils/directives/CustomScroll';
import {ThError, AppContext} from '../../../../../../../../../../../common/utils/AppContext';
import {HotelBookingOperationsPageParam} from './utils/HotelBookingOperationsPageParam';

@Component({
    selector: 'booking-operations-page',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/booking-operations/template/booking-operations-page.html',
    directives: [LoadingComponent, CustomScroll],
    pipes: [TranslationPipe]
})
export class BookingOperationsPageComponent implements OnInit {
    @Input() bookingOperationsPageParam: HotelBookingOperationsPageParam;

    isLoading: boolean;
    didInitOnce: boolean = false;

    constructor() { }

    ngOnInit() {

    }
}