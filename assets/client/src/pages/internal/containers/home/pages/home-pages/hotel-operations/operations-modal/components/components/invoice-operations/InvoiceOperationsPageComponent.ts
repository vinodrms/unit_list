import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Subscription}   from 'rxjs/Subscription';
import {TranslationPipe} from '../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {LoadingComponent} from '../../../../../../../../../../../common/utils/components/LoadingComponent';
import {CustomScroll} from '../../../../../../../../../../../common/utils/directives/CustomScroll';
import {ThError, AppContext} from '../../../../../../../../../../../common/utils/AppContext';
import {ThUtils} from '../../../../../../../../../../../common/utils/ThUtils';
import {HotelInvoiceOperationsPageParam} from './utils/HotelInvoiceOperationsPageParam';
import {HotelOperationsPageFilterMeta} from '../../../services/utils/IHotelOperationsPageParam';
import {IHotelOperationsOnFilterRemovedHandler} from '../../../services/utils/IHotelOperationsOnFilterRemovedHandler';
import {InvoiceEditComponent} from './components/invoice-edit/InvoiceEditComponent';
import {ItemListNavigatorComponent} from '../../../../../../../../../../../common/utils/components/item-list-navigator/ItemListNavigatorComponent';
import {InvoiceOperationsPageService} from './services/InvoiceOperationsPageService';
import {InvoiceOperationsPageData} from './services/utils/InvoiceOperationsPageData';
import {InvoiceGroupControllerService} from './services/InvoiceGroupControllerService';
import {InvoiceDO} from '../../../../../../../../../services/invoices/data-objects/InvoiceDO';
import {InvoiceGroupVM} from '../../../../../../../../../services/invoices/view-models/InvoiceGroupVM';
import {InvoiceVM} from '../../../../../../../../../services/invoices/view-models/InvoiceVM';
import {InvoicePayerVM} from '../../../../../../../../../services/invoices/view-models/InvoicePayerVM';
import {CustomerDO} from '../../../../../../../../../services/customers/data-objects/CustomerDO';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

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
    private _invoiceGroupVMCopy: InvoiceGroupVM;

    isLoading: boolean;
    didInitOnce: boolean = false;

    invoiceNavigatorWindowSize = 6;
    numberOfSimultaneouslyDisplayedInvoices = 2;

    firstDisplayedInvoiceIndex = 0;

    itemsAdded: Subject<number>;
    itemsAddedObservable: Observable<number>;
    itemRemoved: Subject<number>;
    itemRemovedObservable: Observable<number>;

    constructor(private _appContext: AppContext,
        private _invoiceOperationsPageService: InvoiceOperationsPageService,
        private _invoiceGroupControllerService: InvoiceGroupControllerService) {

        this._thUtils = new ThUtils();

        this.itemsAdded = new Subject<number>();
        this.itemsAddedObservable = this.itemsAdded.asObservable();
        this.itemRemoved = new Subject<number>();
        this.itemRemovedObservable = this.itemRemoved.asObservable();
    }

    ngOnInit() {
        this.loadPageData();
        this._appContext.analytics.logPageView("/operations/invoice");
    }
    private loadPageData() {
        this.isLoading = true;

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
        var title = "Invoice Group";
        var subtitle = "";

        this.invoiceOperationsPageParam.onFilterRemovedHandler = (() => {
            this.invoiceOperationsPageParam.updateTitle(title, subtitle, this.filterMetaForDisabledFilter);
            this.editMode = true;
        });

        if (!this._thUtils.isUndefinedOrNull(this.invoiceOperationsPageParam.invoiceFilter.customerId)) {
            this.invoiceOperationsPageParam.updateTitle(title, subtitle, this.filterMetaForEnabledFilter);
        }
        else {
            this.invoiceOperationsPageParam.updateTitle(title, subtitle, this.filterMetaForDisabledFilter);
        }
    }

    public onEdit() {
        this.editMode = true;
    }
    public onSave() {
        var firstInvalidInvoice = this.invoiceGroupVM.checkValidations();
        if (firstInvalidInvoice === -1) {
            this.editMode = false;
        }
    }
    public onCancel() {
        this.invoiceGroupVM = this._invoiceGroupVMCopy;
        this.editMode = false;
    }
    public onAddInvoice() {
        var invoiceVM = new InvoiceVM(this._appContext.thTranslation);
        invoiceVM.buildCleanInvoiceVM();
        this.invoiceGroupVM.invoiceVMList.push(invoiceVM);

        this.itemsAdded.next(1);
    }


    public displayedItemsUpdated(firstDisplayedInvoiceIndex) {
        this.firstDisplayedInvoiceIndex = firstDisplayedInvoiceIndex;
    }

    public newlyAddedInvoiceRemoved(newlyAddedinvoiceIndex) {
        this.itemRemoved.next(newlyAddedinvoiceIndex);
        this.invoiceVMList.splice(newlyAddedinvoiceIndex, 1);
    }

    public get displayedInvoiceIndexList(): number[] {
        var indexList = [];
        for (var index = this.firstDisplayedInvoiceIndex; index < this.firstDisplayedInvoiceIndex + this.numberOfSimultaneouslyDisplayedInvoices; ++index) {
            indexList.push(index);
        }
        return indexList;
    }

    public get filterMetaForEnabledFilter(): HotelOperationsPageFilterMeta {
        return {
            filterInfo: 'filtered by:',
            filterValue: this.invoiceFilterValue,
            filterRemoveInfo: 'Remove filter in order to edit.',
        }
    }

    public get filterMetaForDisabledFilter(): HotelOperationsPageFilterMeta {
        return {
            filterInfo: 'no active filter',
        };
    }

    public get invoiceFilterValue(): string {
        var customerDO = _.chain(this.invoiceGroupVM.invoiceVMList).map((invoiceVM: InvoiceVM) => {
            return invoiceVM.invoicePayerVMList;
        }).flatten().map((invoicePayerVM: InvoicePayerVM) => {
            return invoicePayerVM.customerDO;
        }).find((customerDO: CustomerDO) => {
            return customerDO.id === this.invoiceOperationsPageParam.invoiceFilter.customerId;
        }).value();

        if (!this._thUtils.isUndefinedOrNull(customerDO)) {
            return customerDO.customerName;
        }
        return null;
    }

    public get invoiceGroupVM(): InvoiceGroupVM {
        return this._invoiceGroupControllerService.invoiceGroupVM;
    }
    public set invoiceGroupVM(invoiceGroupVM: InvoiceGroupVM) {
        this._invoiceGroupControllerService.invoiceGroupVM = invoiceGroupVM;
    }
    public get invoiceVMList(): InvoiceVM[] {
        return this.invoiceGroupVM.invoiceVMList;
    }
    public get totalNumberOfInvoices(): number {
        return this.invoiceVMList.length;
    }

    public get filterEnabled(): boolean {
        return !this._thUtils.isUndefinedOrNull(this.invoiceOperationsPageParam.titleMeta.filterMeta.filterValue);
    }

    public get payOnlyMode(): boolean {
        return this.filterEnabled;
    }
    public get payOnlyModeWithEditOption(): boolean {
        return !this.filterEnabled && !this.invoiceGroupVM.editMode;
    }

    public get editMode(): boolean {
        return !this.filterEnabled && this.invoiceGroupVM.editMode;
    }
    public set editMode(editMode: boolean) {
        if(editMode) {
            this._invoiceGroupVMCopy = this.invoiceGroupVM.buildPrototype();
        }
        this.invoiceGroupVM.editMode = editMode;
    }
}