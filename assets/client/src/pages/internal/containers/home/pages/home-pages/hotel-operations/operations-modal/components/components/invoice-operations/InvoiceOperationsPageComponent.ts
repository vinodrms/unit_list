import {Component, OnInit, Input} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {LoadingComponent} from '../../../../../../../../../../../common/utils/components/LoadingComponent';
import {CustomScroll} from '../../../../../../../../../../../common/utils/directives/CustomScroll';
import {ThError, AppContext} from '../../../../../../../../../../../common/utils/AppContext';
import {HotelInvoiceOperationsPageParam} from './utils/HotelInvoiceOperationsPageParam';
import {InvoiceEditComponent} from './components/invoice-edit/InvoiceEditComponent';
import {ItemListNavigatorComponent} from '../../../../../../../../../../../common/utils/components/item-list-navigator/ItemListNavigatorComponent';

@Component({
    selector: 'invoice-operations-page',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/invoice-operations/template/invoice-operations-page.html',
    directives: [LoadingComponent, CustomScroll, ItemListNavigatorComponent, InvoiceEditComponent],
    pipes: [TranslationPipe]
})
export class InvoiceOperationsPageComponent implements OnInit {
    @Input() invoiceOperationsPageParam: HotelInvoiceOperationsPageParam;

    isLoading: boolean;
    didInitOnce: boolean = false;

    totalNumberOfInvoices = 15;
    invoiceNavigatorWindowSize = 10;
    numberOfSimultaneouslyDisplayedInvoices = 2;

    constructor() {
        
    }

    ngOnInit() {
        this.updateContainerData();
    }

    private updateContainerData() {
        var title = "Invoices";
        var subtitle = "";
        this.invoiceOperationsPageParam.updateTitle(title, subtitle);
    }

    public displayedInvoicesUpdated(firstInvoiceIndex: number) {
        console.log('firstInvoiceIndex: ' + firstInvoiceIndex);
    }
}