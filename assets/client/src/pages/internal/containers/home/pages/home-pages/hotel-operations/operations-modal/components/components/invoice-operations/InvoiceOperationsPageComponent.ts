import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { LoadingComponent } from '../../../../../../../../../../../common/utils/components/LoadingComponent';
import { CustomScroll } from '../../../../../../../../../../../common/utils/directives/CustomScroll';
import { ThError, AppContext } from '../../../../../../../../../../../common/utils/AppContext';
import { ThUtils } from '../../../../../../../../../../../common/utils/ThUtils';
import { HotelInvoiceOperationsPageParam } from './utils/HotelInvoiceOperationsPageParam';
import { HotelOperationsPageFilterMeta } from '../../../services/utils/IHotelOperationsPageParam';
import { IHotelOperationsOnFilterRemovedHandler } from '../../../services/utils/IHotelOperationsOnFilterRemovedHandler';
import { ItemListNavigatorConfig } from '../../../../../../../../../../../common/utils/components/item-list-navigator/ItemListNavigatorConfig';
import { InvoiceOperationsPageService } from './services/InvoiceOperationsPageService';
import { InvoiceOperationsPageData } from './services/utils/InvoiceOperationsPageData';
import { InvoiceGroupControllerService } from './services/InvoiceGroupControllerService';
import { InvoiceDO } from '../../../../../../../../../services/invoices/data-objects/InvoiceDO';
import { InvoiceGroupDO } from '../../../../../../../../../services/invoices/data-objects/InvoiceGroupDO';
import { InvoiceGroupVM } from '../../../../../../../../../services/invoices/view-models/InvoiceGroupVM';
import { InvoiceVM } from '../../../../../../../../../services/invoices/view-models/InvoiceVM';
import { InvoicePayerVM } from '../../../../../../../../../services/invoices/view-models/InvoicePayerVM';
import { CustomerDO } from '../../../../../../../../../services/customers/data-objects/CustomerDO';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { InvoiceMeta } from './components/invoice-edit/InvoiceMeta';
import { InvoiceGroupsService } from '../../../../../../../../../services/invoices/InvoiceGroupsService';
import { HotelOperationsResultService } from '../../../../operations-modal/services/HotelOperationsResultService';
import { ModalDialogRef } from '../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import { HotelOperationsResult } from '../../../services/utils/HotelOperationsResult';
import { ItemAdditionMeta } from "../../../../../../../../../../../common/utils/components/item-list-navigator/ItemAdditionMeta";

@Component({
    selector: 'invoice-operations-page',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/invoice-operations/template/invoice-operations-page.html',
    providers: [InvoiceOperationsPageService, InvoiceGroupControllerService]
})
export class InvoiceOperationsPageComponent implements OnInit {
    @Input() invoiceOperationsPageParam: HotelInvoiceOperationsPageParam;

    private static MAX_NO_OF_INVOICES = 100;

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
    itemsAdded: Subject<ItemAdditionMeta>;
    itemsAddedObservable: Observable<ItemAdditionMeta>;
    itemRemoved: Subject<number>;
    itemRemovedObservable: Observable<number>;
    selectItem: Subject<number>;
    selectItemObservable: Observable<number>;

    constructor(private _appContext: AppContext,
        private _modalDialogRef: ModalDialogRef<HotelOperationsResult>,
        private _hotelOperationsResultService: HotelOperationsResultService,
        private _invoiceOperationsPageService: InvoiceOperationsPageService,
        private _invoiceGroupControllerService: InvoiceGroupControllerService,
        private _invoiceGroupsService: InvoiceGroupsService) {

        this._thUtils = new ThUtils();
        this._title = "Invoice Group";

        this.resetItemNavigator = new Subject<ItemListNavigatorConfig>();
        this.resetItemNavigatorObservable = this.resetItemNavigator.asObservable();
        this.itemsAdded = new Subject<ItemAdditionMeta>();
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

        this.editMode = this.invoiceOperationsPageParam.openInEditMode;

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
        }
    }

    public onEdit() {
        this.editMode = true;
    }
    public onSave() {
        if (this.totalNumberOfInvoices === 0) {
            var title = this._appContext.thTranslation.translate("Info");
            var content = this._appContext.thTranslation.translate("You cannot save an invoice group if it does not contain at least an invoice.");
            var positiveLabel = this._appContext.thTranslation.translate("OK");

            this._appContext.modalService.confirm(title, content, { positive: positiveLabel }, () => {

            });
        }
        else {
            var firstInvalidInvoice = this.invoiceGroupVM.checkValidations();
            if (firstInvalidInvoice === -1) {
                var invoiceGroupVMClone = this.invoiceGroupVM.buildPrototype();
                var invoiceGroupDOToSave = invoiceGroupVMClone.buildInvoiceGroupDO();
                this._invoiceGroupsService.saveInvoiceGroupDO(invoiceGroupDOToSave).subscribe((updatedInvoiceGroupDO: InvoiceGroupDO) => {
                    this._invoiceGroupControllerService.updateInvoiceGroupVM(updatedInvoiceGroupDO);
                    this._appContext.toaster.success(this._appContext.thTranslation.translate("The invoice group was saved successfully."));
                    this._hotelOperationsResultService.markInvoiceChanged(updatedInvoiceGroupDO);
                    this.editMode = false;
                }, (error: ThError) => {
                    this._appContext.toaster.error(error.message);
                });

            }
            else {
                this.selectItem.next(firstInvalidInvoice);
            }
        }
    }
    public onCancel() {
        var title = 'Info';
        var content = 'You might have unsaved changes. Are you sure you want to cancel?';
        var positiveLabel = 'Yes';
        var negativeLabel = 'No';

        this._appContext.modalService.confirm(title, content, { positive: positiveLabel, negative: negativeLabel }, () => {
            if (this.invoiceGroupVM.allInvoicesAreNewlyAdded()) {
                this._modalDialogRef.closeForced();
            }
            else {
                this.resetItemNavigator.next({
                    initialNumberOfItems: this._invoiceGroupVMCopy.invoiceVMList.length,
                    maxNumberOfDisplayedItems: this.invoiceNavigatorWindowSize,
                    numberOfSimultaneouslySelectedItems: this.numberOfSimultaneouslyDisplayedInvoices
                });
                this.invoiceGroupVM = this._invoiceGroupVMCopy;
            }
        });
    }
    public onAddInvoice() {
        if (this.maxNoOfInvoicesLimitExceeeded()) {
            var title = this._appContext.thTranslation.translate("Info");
            var content = this._appContext.thTranslation.translate("The maximum number of %maxNoOfInvoices% invoices was exceeded.", {
                maxNoOfInvoices: InvoiceOperationsPageComponent.MAX_NO_OF_INVOICES
            });
            var positiveLabel = this._appContext.thTranslation.translate("OK");

            this._appContext.modalService.confirm(title, content, { positive: positiveLabel }, () => {

            });
        }
        else {
            var invoiceVM = new InvoiceVM(this._appContext.thTranslation);
            invoiceVM.buildCleanInvoiceVM(this.newInvoiceRef);
            this.invoiceGroupVM.addInvoiceVM(invoiceVM);
            this.itemsAdded.next({
                noOfAddedItems: 1,
                shouldSelectLastElement: true
            });
        }
    }

    private maxNoOfInvoicesLimitExceeeded(): boolean {
        return this.invoiceGroupVM.invoiceVMList.length >= InvoiceOperationsPageComponent.MAX_NO_OF_INVOICES;
    }

    private get newInvoiceRef(): string {
        return 'iv' + this.invoiceGroupVM.newInvoiceSeq;
    }

    public displayedItemsUpdated(firstDisplayedInvoiceIndex) {
        this.firstDisplayedInvoiceIndex = firstDisplayedInvoiceIndex;
    }

    public newlyAddedInvoiceRemoved(newlyAddedInvoiceMeta: InvoiceMeta) {
        this.itemRemoved.next(newlyAddedInvoiceMeta.indexInDisplayedInvoiceList);
        this.invoiceGroupVM.removeInvoiceVMByUniqueId(newlyAddedInvoiceMeta.uniqueId);
    }

    public creditInvoiceAdded() {
        this.itemsAdded.next({
            noOfAddedItems: 1,
            shouldSelectLastElement: false
        });
    }

    public get noEditableInvoicesExist(): boolean {
        return _.isEmpty(this.displayedInvoiceIndexList);
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

    public get groupBookingId(): string {
        return this.invoiceGroupVM.invoiceGroupDO.groupBookingId;
    }

    public getInvoiceUniqueIdentifier(invoiceIndex: number): string {
        return this.invoiceVMList[invoiceIndex].invoiceDO.getUniqueIdentifier();
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
            this._invoiceGroupVMCopy = this.invoiceGroupVM.buildPrototype();
            this.invoiceOperationsPageParam.updateTitle(this._title, 'Edit');
            this.resetPaginationCount(this.invoiceGroupVM.getOpenInvoiceVMList().length);
        }
        else {
            this.invoiceOperationsPageParam.updateTitle(this._title, '');
            this.resetPaginationCount(this.invoiceGroupVM.invoiceVMList.length);
        }
        this.invoiceGroupVM.editMode = editMode;
    }
    private resetPaginationCount(noOfItems: number) {
        this.resetItemNavigator.next({
            initialNumberOfItems: noOfItems,
            maxNumberOfDisplayedItems: this.invoiceNavigatorWindowSize,
            numberOfSimultaneouslySelectedItems: this.numberOfSimultaneouslyDisplayedInvoices
        });
    }
}