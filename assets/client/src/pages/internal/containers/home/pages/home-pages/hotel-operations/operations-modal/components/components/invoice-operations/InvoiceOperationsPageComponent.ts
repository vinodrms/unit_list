import {Component, OnInit, Input} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {LoadingComponent} from '../../../../../../../../../../../common/utils/components/LoadingComponent';
import {CustomScroll} from '../../../../../../../../../../../common/utils/directives/CustomScroll';
import {ThError, AppContext} from '../../../../../../../../../../../common/utils/AppContext';
import {HotelInvoiceOperationsPageParam} from './utils/HotelInvoiceOperationsPageParam';

@Component({
    selector: 'invoice-operations-page',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/invoice-operations/template/invoice-operations-page.html',
    directives: [LoadingComponent, CustomScroll],
    pipes: [TranslationPipe]
})
export class InvoiceOperationsPageComponent implements OnInit {
    @Input() invoiceOperationsPageParam: HotelInvoiceOperationsPageParam;

    isLoading: boolean;
    didInitOnce: boolean = false;

    constructor() { }

    ngOnInit() {

    }
}