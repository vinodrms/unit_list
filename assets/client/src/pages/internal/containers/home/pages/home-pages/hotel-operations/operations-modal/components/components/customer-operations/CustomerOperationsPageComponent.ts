import {Component, OnInit, Input} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {LoadingComponent} from '../../../../../../../../../../../common/utils/components/LoadingComponent';
import {CustomScroll} from '../../../../../../../../../../../common/utils/directives/CustomScroll';
import {ThError, AppContext} from '../../../../../../../../../../../common/utils/AppContext';
import {HotelCustomerOperationsPageParam} from './utils/HotelCustomerOperationsPageParam';

@Component({
    selector: 'customer-operations-page',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/customer-operations/template/customer-operations-page.html',
    directives: [LoadingComponent, CustomScroll],
    pipes: [TranslationPipe]
})
export class CustomerOperationsPageComponent implements OnInit {
    @Input() customerOperationsPageParam: HotelCustomerOperationsPageParam;

    isLoading: boolean;
    didInitOnce: boolean = false;

    constructor() { }

    ngOnInit() {

    }
}