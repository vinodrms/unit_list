import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Subscription}   from 'rxjs/Subscription';
import {TranslationPipe} from '../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {LoadingComponent} from '../../../../../../../../../../../common/utils/components/LoadingComponent';
import {CustomScroll} from '../../../../../../../../../../../common/utils/directives/CustomScroll';
import {ThError, AppContext} from '../../../../../../../../../../../common/utils/AppContext';
import {ThUtils} from '../../../../../../../../../../../common/utils/ThUtils';
import {HotelInvoiceOperationsPageParam} from './utils/HotelInvoiceOperationsPageParam';
import {InvoiceEditComponent} from './components/invoice-edit/InvoiceEditComponent';
import {ItemListNavigatorComponent} from '../../../../../../../../../../../common/utils/components/item-list-navigator/ItemListNavigatorComponent';
import {InvoiceOperationsPageService} from './services/InvoiceOperationsPageService';
import {InvoiceOperationsPageData} from './services/utils/InvoiceOperationsPageData';
import {InvoiceGroupControllerService, InvoiceItemMoveAction, InvoiceItemMoveActionType} from './services/InvoiceGroupControllerService';
import {InvoiceDO} from '../../../../../../../../../services/invoices/data-objects/InvoiceDO';

@Component({
    selector: 'invoice-operations-page',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/invoice-operations/template/invoice-operations-page.html',
    directives: [LoadingComponent, CustomScroll, ItemListNavigatorComponent, InvoiceEditComponent],
    providers: [InvoiceOperationsPageService, InvoiceGroupControllerService],
    pipes: [TranslationPipe]
})
export class InvoiceOperationsPageComponent implements OnInit {
    @Input() invoiceOperationsPageParam: HotelInvoiceOperationsPageParam;

    private _thUtils: ThUtils;

    isLoading: boolean;
    didInitOnce: boolean = false;

    invoiceNavigatorWindowSize = 10;
    numberOfSimultaneouslyDisplayedInvoices = 2;

    moveInvoiceItemSubscription: Subscription;

    constructor(private _appContext: AppContext,
        private _invoiceOperationsPageService: InvoiceOperationsPageService,
        private _invoiceGroupControllerService: InvoiceGroupControllerService) {
        
        this._thUtils = new ThUtils();
    }

    ngOnInit() {
        this.loadPageData();
        this._appContext.analytics.logPageView("/operations/invoice");
    }
    private loadPageData() {
        this.isLoading = true;

        this.invoiceOperationsPageParam = new HotelInvoiceOperationsPageParam('57a1c08d67e668b81f2bbd1b', {});

        this._invoiceOperationsPageService.getPageData(this.invoiceOperationsPageParam).subscribe((pageData: InvoiceOperationsPageData) => {
            this._invoiceGroupControllerService.invoiceOperationsPageData = pageData;
            
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

    public get invoiceOperationsPageData(): InvoiceOperationsPageData {
        return this._invoiceGroupControllerService.invoiceOperationsPageData;
    }
    public get invoiceList(): InvoiceDO[] {
        return this.invoiceOperationsPageData.invoiceGroupDO.invoiceList;        
    }
    public get totalNumberOfInvoices(): number {
        return this.invoiceList.length;        
    }
}