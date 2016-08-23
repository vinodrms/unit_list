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
import {ItemListNavigatorConfig} from '../../../../../../../../../../../common/utils/components/item-list-navigator/ItemListNavigatorConfig';
import {InvoiceOperationsPageService} from './services/InvoiceOperationsPageService';
import {InvoiceOperationsPageData} from './services/utils/InvoiceOperationsPageData';
import {InvoiceGroupControllerService} from './services/InvoiceGroupControllerService';
import {InvoiceDO} from '../../../../../../../../../services/invoices/data-objects/InvoiceDO';
import {InvoiceGroupDO} from '../../../../../../../../../services/invoices/data-objects/InvoiceGroupDO';
import {InvoiceGroupVM} from '../../../../../../../../../services/invoices/view-models/InvoiceGroupVM';
import {InvoiceVM} from '../../../../../../../../../services/invoices/view-models/InvoiceVM';
import {InvoicePayerVM} from '../../../../../../../../../services/invoices/view-models/InvoicePayerVM';
import {CustomerDO} from '../../../../../../../../../services/customers/data-objects/CustomerDO';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {InvoiceMeta} from './components/invoice-edit/InvoiceMeta';
import {InvoiceGroupsService} from '../../../../../../../../../services/invoices/InvoiceGroupsService';

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
    private _title: string;

    isLoading: boolean;
    didInitOnce: boolean = false;

    itemListNavigatorConfig: ItemListNavigatorConfig;

    invoiceNavigatorWindowSize = 6;
    numberOfSimultaneouslyDisplayedInvoices = 2;

    firstDisplayedInvoiceIndex = 0;

    resetItemNavigator: Subject<ItemListNavigatorConfig>;
    resetItemNavigatorObservable: Observable<ItemListNavigatorConfig>;
    itemsAdded: Subject<number>;
    itemsAddedObservable: Observable<number>;
    itemRemoved: Subject<number>;
    itemRemovedObservable: Observable<number>;
    selectItem: Subject<number>;
    selectItemObservable: Observable<number>;

    constructor(private _appContext: AppContext,
        private _invoiceOperationsPageService: InvoiceOperationsPageService,
        private _invoiceGroupControllerService: InvoiceGroupControllerService,
        private _invoiceGroupsService: InvoiceGroupsService) {

        this._thUtils = new ThUtils();
        this._title = "Invoice Group";

        this.resetItemNavigator = new Subject<ItemListNavigatorConfig>();
        this.resetItemNavigatorObservable = this.resetItemNavigator.asObservable();
        this.itemsAdded = new Subject<number>();
        this.itemsAddedObservable = this.itemsAdded.asObservable();
        this.itemRemoved = new Subject<number>();
        this.itemRemovedObservable = this.itemRemoved.asObservable();
        this.selectItem = new Subject<number>();
        this.selectItemObservable = this.selectItem.asObservable();
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
        var subtitle = "";
        
        this.invoiceOperationsPageParam.onFilterRemovedHandler = (() => {
            this.editMode = true;
        });

        if (!this._thUtils.isUndefinedOrNull(this.invoiceOperationsPageParam.invoiceGroupId) && 
            !this._thUtils.isUndefinedOrNull(this.invoiceOperationsPageParam.invoiceFilter.customerId)) {
            this.invoiceOperationsPageParam.updateTitle(this._title, subtitle, this.filterMetaForEnabledFilter);
            this.itemListNavigatorConfig = {
                initialNumberOfItems: this.invoiceVMList.length,
                maxNumberOfDisplayedItems: this.invoiceNavigatorWindowSize,
                numberOfSimultaneouslySelectedItems: this.numberOfSimultaneouslyDisplayedInvoices
            }
        }
        else {
            this.invoiceOperationsPageParam.updateTitle(this._title, subtitle);
            this.itemListNavigatorConfig = {
                initialNumberOfItems: this.totalNumberOfInvoices,
                maxNumberOfDisplayedItems: this.invoiceNavigatorWindowSize,
                numberOfSimultaneouslySelectedItems: this.numberOfSimultaneouslyDisplayedInvoices
            };
            this.editMode = true;
        }
    }

    public onEdit() {
        this.editMode = true;
    }
    public onSave() {
        var firstInvalidInvoice = this.invoiceGroupVM.checkValidations();
        if (firstInvalidInvoice === -1) {
            var invoiceGroupVMClone = this.invoiceGroupVM.buildPrototype();
            var invoiceGroupDOToSave = invoiceGroupVMClone.buildInvoiceGroupDO();

            this._invoiceGroupsService.saveInvoiceGroupDO(invoiceGroupDOToSave).subscribe((updatedInvoiceGroupDO: InvoiceGroupDO) => {
                this._invoiceGroupControllerService.updateInvoiceGroupVM(updatedInvoiceGroupDO);
                this._appContext.toaster.success(this._appContext.thTranslation.translate("The invoice group was saved successfully."));
                this.editMode = false;
            }, (error: ThError) => {
                this._appContext.toaster.error(error.message);
            });

        }
        else {
            this.selectItem.next(firstInvalidInvoice);
        }
    }
    public onCancel() {
        var title = 'Info';
        var content = 'You might have unsaved changes. Are you sure you want to cancel?';
        var positiveLabel = 'Yes';
        var negativeLabel = 'No';

        this._appContext.modalService.confirm(title, content, { positive: positiveLabel, negative: negativeLabel }, () => {
            this.resetItemNavigator.next({
                initialNumberOfItems: this._invoiceGroupVMCopy.invoiceVMList.length,
                maxNumberOfDisplayedItems: this.invoiceNavigatorWindowSize,
                numberOfSimultaneouslySelectedItems: this.numberOfSimultaneouslyDisplayedInvoices
            });
            this.invoiceGroupVM = this._invoiceGroupVMCopy;
            this.editMode = false;
        });
    }
    public onAddInvoice() {
        var invoiceVM = new InvoiceVM(this._appContext.thTranslation);
        invoiceVM.buildCleanInvoiceVM(this.newInvoiceRef);
        this.invoiceGroupVM.addInvoiceVM(invoiceVM);
        this.itemsAdded.next(1);
    }

    private get newInvoiceRef(): string {
        return 'iv' + this.invoiceGroupVM.newInvoiceSeq;
    }

    public displayedItemsUpdated(firstDisplayedInvoiceIndex) {
        this.firstDisplayedInvoiceIndex = firstDisplayedInvoiceIndex;
    }

    public newlyAddedInvoiceRemoved(newlyAddedInvoiceMeta: InvoiceMeta) {
        console.log(this.displayedInvoiceIndexList);
        this.itemRemoved.next(newlyAddedInvoiceMeta.indexInDisplayedInvoiceList);
        this.invoiceGroupVM.removeInvoiceVMByReference(newlyAddedInvoiceMeta.reference);
        console.log(this.displayedInvoiceIndexList);
    }

    public get displayedInvoiceIndexList(): number[] {
        var indexList = [];
        
        if (!_.isEmpty(this.invoiceVMList)) {
            for (var index = this.firstDisplayedInvoiceIndex; index < Math.min(this.firstDisplayedInvoiceIndex + this.numberOfSimultaneouslyDisplayedInvoices, this.invoiceVMList.length); ++index) {
                indexList.push(index);
            }
        }
        return indexList;
    }

    public getInvoiceReference(invoiceIndex: number): string {
        return this.invoiceVMList[invoiceIndex].invoiceDO.invoiceReference;
    }

    public get filterMetaForEnabledFilter(): HotelOperationsPageFilterMeta {
        return {
            filterInfo: 'filtered by:',
            filterValue: this.invoiceFilterValue,
            filterRemoveInfo: 'Remove filter in order to edit.',
        }
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
        if (this.filterEnabled) {
            return _.filter(this.invoiceGroupVM.invoiceVMList, (invoiceVM: InvoiceVM) => {
                var customerIdList = _.map(invoiceVM.invoicePayerVMList, (invoicePayerVM: InvoicePayerVM) => {
                    return invoicePayerVM.invoicePayerDO.customerId;
                })
                return _.contains(customerIdList, this.invoiceOperationsPageParam.invoiceFilter.customerId);
            });
        }
        return this.invoiceGroupVM.invoiceVMList;
    }
    public get totalNumberOfInvoices(): number {
        return this.invoiceVMList.length;
    }

    public get filterEnabled(): boolean {
        var filterMeta = this.invoiceOperationsPageParam.titleMeta.filterMeta;
        return !this._thUtils.isUndefinedOrNull(filterMeta) &&
            !this._thUtils.isUndefinedOrNull(filterMeta.filterValue)
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
        if (editMode) {
            this.resetItemNavigator.next({
                initialNumberOfItems: this.invoiceGroupVM.getUnpaidInvoiceVMList().length,
                maxNumberOfDisplayedItems: this.invoiceNavigatorWindowSize,
                numberOfSimultaneouslySelectedItems: this.numberOfSimultaneouslyDisplayedInvoices
            });
            this._invoiceGroupVMCopy = this.invoiceGroupVM.buildPrototype();
            this.invoiceOperationsPageParam.updateTitle(this._title, 'Edit');
        }
        else {
            this.invoiceOperationsPageParam.updateTitle(this._title, '');
        }
        this.invoiceGroupVM.editMode = editMode;
    }
}