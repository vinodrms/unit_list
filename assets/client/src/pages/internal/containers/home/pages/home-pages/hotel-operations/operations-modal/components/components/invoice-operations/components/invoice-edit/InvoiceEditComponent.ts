import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {AppContext, ThError} from '../../../../../../../../../../../../../common/utils/AppContext';
import {InvoicePayerComponent} from '../invoice-payer/InvoicePayerComponent';
import {ThButtonComponent} from '../../../../../../../../../../../../../common/utils/components/ThButtonComponent';
import {AddOnProductsModalService} from '../../../../../../../../../../common/inventory/add-on-products/modal/services/AddOnProductsModalService';
import {NumberOfAddOnProductsModalService} from './modals/services/NumberOfAddOnProductsModalService';
import {NumberOfAddOnProductsModalOutput} from './modals/services/utils/NumberOfAddOnProductsModalOutput';
import {AddOnProductDO} from '../../../../../../../../../../../services/add-on-products/data-objects/AddOnProductDO';
import {ModalDialogRef} from '../../../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {CustomerRegisterModalService} from '../../../../../../../../../../common/inventory/customer-register/modal/services/CustomerRegisterModalService';
import {InvoiceGroupDO} from '../../../../../../../../../../../services/invoices/data-objects/InvoiceGroupDO';
import {InvoiceGroupVM} from '../../../../../../../../../../../services/invoices/view-models/InvoiceGroupVM';
import {InvoiceDO, InvoicePaymentStatus} from '../../../../../../../../../../../services/invoices/data-objects/InvoiceDO';
import {InvoiceItemDO, InvoiceItemType} from '../../../../../../../../../../../services/invoices/data-objects/items/InvoiceItemDO';
import {AddOnProductInvoiceItemMetaDO} from '../../../../../../../../../../../services/invoices/data-objects/items/add-on-products/AddOnProductInvoiceItemMetaDO';
import {InvoiceVM} from '../../../../../../../../../../../services/invoices/view-models/InvoiceVM';
import {InvoicePayerDO} from '../../../../../../../../../../../services/invoices/data-objects/payers/InvoicePayerDO';
import {InvoicePayerVM} from '../../../../../../../../../../../services/invoices/view-models/InvoicePayerVM';
import {InvoiceItemVM} from '../../../../../../../../../../../services/invoices/view-models/InvoiceItemVM';
import {CustomerDO} from '../../../../../../../../../../../services/customers/data-objects/CustomerDO';
import {InvoiceGroupControllerService} from '../../services/InvoiceGroupControllerService';
import {CustomScroll} from '../../../../../../../../../../../../../common/utils/directives/CustomScroll';
import {InvoiceGroupsService} from '../../../../../../../../../../../services/invoices/InvoiceGroupsService';

@Component({
    selector: 'invoice-edit',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/invoice-operations/components/invoice-edit/template/invoice-edit.html',
    directives: [InvoicePayerComponent, ThButtonComponent, CustomScroll],
    providers: [AddOnProductsModalService, NumberOfAddOnProductsModalService, CustomerRegisterModalService],
    pipes: [TranslationPipe]
})
export class InvoiceEditComponent implements OnInit {
    @Input() invoiceReference: string;
    @Output() newlyAddedInvoiceRemoved = new EventEmitter();

    private _selectedInvoiceItemIndex: number;

    constructor(private _appContext: AppContext,
        private _addOnProductsModalService: AddOnProductsModalService,
        private _numberOfAddOnProductsModalService: NumberOfAddOnProductsModalService,
        private _customerRegisterModalService: CustomerRegisterModalService,
        private _invoiceGroupsService: InvoiceGroupsService,
        private _invoiceGroupControllerService: InvoiceGroupControllerService) {
    }

    ngOnInit() {
    }

    public openAddOnProductSelectModal() {
        this._addOnProductsModalService.openAddOnProductsModal(false).then((modalDialogInstance: ModalDialogRef<AddOnProductDO[]>) => {
            modalDialogInstance.resultObservable.subscribe((selectedAddOnProductList: AddOnProductDO[]) => {
                if (!_.isEmpty(selectedAddOnProductList)) {
                    this._numberOfAddOnProductsModalService.openModal(selectedAddOnProductList[0].id).then((modalDialogInstance: ModalDialogRef<NumberOfAddOnProductsModalOutput>) => {
                        modalDialogInstance.resultObservable.subscribe((numberOfAopSelection: NumberOfAddOnProductsModalOutput) => {
                            this.invoiceVM.addItemOnInvoice(selectedAddOnProductList[0], numberOfAopSelection.noOfItems);
                            this.invoiceGroupVM.updatePriceToPayIfSinglePayerByRef(this.invoiceReference);
                        });
                    });
                }
            });
        }).catch((e: any) => { });
    }

    public openCustomerSelectModal() {
        this._customerRegisterModalService.openCustomerRegisterModal(false).then((modalDialogInstance: ModalDialogRef<CustomerDO[]>) => {
            modalDialogInstance.resultObservable.subscribe((selectedCustomerList: CustomerDO[]) => {
                this.invoiceVM.addInvoicePayer(selectedCustomerList[0]);
                this._invoiceGroupControllerService.invoiceOperationsPageData.customersContainer.appendCustomer(selectedCustomerList[0]);
            });
        }).catch((e: any) => { });
    }

    public onDelete() {
        var title = this._appContext.thTranslation.translate("Info");
        var content = this._appContext.thTranslation.translate("Are you sure you want to remove this recently added invoice?");
        var positiveLabel = this._appContext.thTranslation.translate("Yes");
        var negativeLabel = this._appContext.thTranslation.translate("No");
        this._appContext.modalService.confirm(title, content, { positive: positiveLabel, negative: negativeLabel }, () => {
            this.newlyAddedInvoiceRemoved.emit({
                indexInDisplayedInvoiceList: this.invoiceVMIndex,
                reference: this.invoiceVM.invoiceDO.invoiceReference
            });
        });
    }

    public onPayInvoice() {

        if (!this.invoiceVM.invoiceDO.allAmountWasPaid()) {
            var title = this._appContext.thTranslation.translate("Info");
            var content = this._appContext.thTranslation.translate("You cannot mark this invoice as paid. The total amount paid is lower than the total price.");
            var positiveLabel = this._appContext.thTranslation.translate("Ok");

            this._appContext.modalService. confirm(title, content, { positive: positiveLabel }, () => {
                
            });
        }
        else {
            var title = this._appContext.thTranslation.translate("Info");
            var content = this._appContext.thTranslation.translate("By marking this invoice as paid you acknowledge that all payments were made. Continue?");
            var positiveLabel = this._appContext.thTranslation.translate("Yes");
            var negativeLabel = this._appContext.thTranslation.translate("No");
            this._appContext.modalService.confirm(title, content, { positive: positiveLabel, negative: negativeLabel }, () => {
                var invoiceGroupVMClone = this.invoiceGroupVM.buildPrototype();
                for (var i = 0; i < invoiceGroupVMClone.invoiceVMList.length; ++i) {
                    if (invoiceGroupVMClone.invoiceVMList[i].invoiceDO.invoiceReference === this.invoiceReference) {
                        invoiceGroupVMClone.invoiceVMList[i].invoiceDO.paymentStatus = InvoicePaymentStatus.Paid;
                    }
                }
                var invoiceGroupDOToSave = invoiceGroupVMClone.buildInvoiceGroupDO();
                this._invoiceGroupsService.saveInvoiceGroupDO(invoiceGroupDOToSave).subscribe((updatedInvoiceGroupDO: InvoiceGroupDO) => {
                    this._invoiceGroupControllerService.updateInvoiceGroupVM(updatedInvoiceGroupDO);
                    this._appContext.toaster.success(this._appContext.thTranslation.translate("The invoice was marked as paid."));
                }, (error: ThError) => {
                    this._appContext.toaster.error(error.message);
                });
            });
        }
    }

    public get ccySymbol(): string {
        return this.invoiceGroupVM.ccySymbol;
    }
    public get totalPrice(): number {
        return this.invoiceVM.totalPrice;
    }
    public get errorMessageList(): string[] {
        return this.invoiceVM.errorMessageList;
    }
    private get invoiceGroupVM(): InvoiceGroupVM {
        return this._invoiceGroupControllerService.invoiceGroupVM;
    }
    private get invoiceVM(): InvoiceVM {
        for (var i = 0; i < this.invoiceGroupVM.invoiceVMList.length; ++i) {
            if (this.invoiceGroupVM.invoiceVMList[i].invoiceDO.invoiceReference === this.invoiceReference) {
                return this.invoiceGroupVM.invoiceVMList[i];
            }
        }
    }
    private get invoiceVMIndex(): number {
        for (var i = 0; i < this.invoiceGroupVM.invoiceVMList.length; ++i) {
            if (this.invoiceGroupVM.invoiceVMList[i].invoiceDO.invoiceReference === this.invoiceReference) {
                return i;
            }
        }
    }
    public get invoicePayerVMList(): InvoicePayerVM[] {
        return this.invoiceVM.invoicePayerVMList;
    }
    public get invoiceItemVMList(): InvoiceItemVM[] {
        return this.invoiceVM.invoceItemVMList;
    }

    public selectInvoiceItem(invoiceItemIndex: number) {
        if (!this.editMode || !this.invoiceItemVMList[invoiceItemIndex].isMovable()) {
            return;
        }
        this._selectedInvoiceItemIndex = invoiceItemIndex;
    }
    public invoiceItemSelected(invoiceItemIndex: number) {
        return this._selectedInvoiceItemIndex === invoiceItemIndex;
    }
    public get editMode(): boolean {
        return this.invoiceGroupVM.editMode && !this.invoiceVM.invoiceDO.isPaid;
    }
    public get isPaid(): boolean {
        return this.invoiceVM.invoiceDO.isPaid;
    }
    public get isNewlyAdded(): boolean {
        return this.invoiceVM.isNewlyAdded;
    }

    public moveLeft(invoiceItemVMIndex: number) {
        if (!this.hasLeftEditableNeighbor()) {
            return;
        }
        this.invoiceGroupVM.moveInvoiceItemLeft(this.invoiceReference, invoiceItemVMIndex);
    }

    public moveRight(invoiceItemVMIndex: number) {
        if (!this.hasRightEditableNeighbor()) {
            return;
        }
        this.invoiceGroupVM.moveInvoiceItemRight(this.invoiceReference, invoiceItemVMIndex);
    }

    public hasRightEditableNeighbor(): boolean {
        return this.invoiceGroupVM.getRightEditableNeighborIndex(this.invoiceReference) != -1;
    }

    public hasLeftEditableNeighbor(): boolean {
        return this.invoiceGroupVM.getLeftEditableNeighborIndex(this.invoiceReference) != -1;
    }
}