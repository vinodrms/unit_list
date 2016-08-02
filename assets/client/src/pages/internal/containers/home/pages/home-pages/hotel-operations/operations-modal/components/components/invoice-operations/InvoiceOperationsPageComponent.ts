import {Component, OnInit, Input} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {LoadingComponent} from '../../../../../../../../../../../common/utils/components/LoadingComponent';
import {CustomScroll} from '../../../../../../../../../../../common/utils/directives/CustomScroll';
import {ThError, AppContext} from '../../../../../../../../../../../common/utils/AppContext';
import {HotelInvoiceOperationsPageParam} from './utils/HotelInvoiceOperationsPageParam';
import {InvoiceEditComponent} from './components/invoice-edit/InvoiceEditComponent';
import {ItemListNavigatorComponent} from '../../../../../../../../../../../common/utils/components/item-list-navigator/ItemListNavigatorComponent';
import {InvoiceOperationsPageService} from './services/InvoiceOperationsPageService';
import {InvoiceOperationsPageData} from './services/utils/InvoiceOperationsPageData';

@Component({
    selector: 'invoice-operations-page',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/invoice-operations/template/invoice-operations-page.html',
    directives: [LoadingComponent, CustomScroll, ItemListNavigatorComponent, InvoiceEditComponent],
    providers: [InvoiceOperationsPageService],
    pipes: [TranslationPipe]
})
export class InvoiceOperationsPageComponent implements OnInit {
    @Input() invoiceOperationsPageParam: HotelInvoiceOperationsPageParam;

    isLoading: boolean;
    didInitOnce: boolean = false;

    totalNumberOfInvoices = 15;
    invoiceNavigatorWindowSize = 10;
    numberOfSimultaneouslyDisplayedInvoices = 2;

    invoiceOperationsPageData: InvoiceOperationsPageData;

    constructor(private _appContext: AppContext,
        private _invoiceOperationsPageService: InvoiceOperationsPageService) {
        
    }

    ngOnInit() {
        this.loadPageData();
    }
    private loadPageData() {
        this.isLoading = true;

        this.invoiceOperationsPageParam = new HotelInvoiceOperationsPageParam('57975aeea33e4cc434fc42cb', {});

        this._invoiceOperationsPageService.getPageData(this.invoiceOperationsPageParam).subscribe((pageData: InvoiceOperationsPageData) => {
            this.invoiceOperationsPageData = pageData;
            this.isLoading = false;
            this.didInitOnce = true;
            this.updateContainerData();
        }, (err: ThError) => {
            this._appContext.toaster.error(err.message);
            this.isLoading = false;
        });
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