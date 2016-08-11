import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {AppContext, ThError} from '../../../../../../../../../../../../../common/utils/AppContext';
import {InvoicePayerComponent} from '../invoice-payer/InvoicePayerComponent';
import {ThButtonComponent} from '../../../../../../../../../../../../../common/utils/components/ThButtonComponent';
import {AddOnProductsModalService} from '../../../../../../../../../../common/inventory/add-on-products/modal/services/AddOnProductsModalService';
import {AddOnProductDO} from '../../../../../../../../../../../services/add-on-products/data-objects/AddOnProductDO';
import {ModalDialogRef} from '../../../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {CustomerRegisterModalService} from '../../../../../../../../../../common/inventory/customer-register/modal/services/CustomerRegisterModalService';
import {InvoiceGroupDO} from '../../../../../../../../../../../services/invoices/data-objects/InvoiceGroupDO';
import {InvoiceGroupVM} from '../../../../../../../../../../../services/invoices/view-models/InvoiceGroupVM';
import {InvoiceDO} from '../../../../../../../../../../../services/invoices/data-objects/InvoiceDO';
import {InvoiceVM} from '../../../../../../../../../../../services/invoices/view-models/InvoiceVM';
import {InvoicePayerDO} from '../../../../../../../../../../../services/invoices/data-objects/payers/InvoicePayerDO';
import {InvoicePayerVM} from '../../../../../../../../../../../services/invoices/view-models/InvoicePayerVM';
import {InvoiceItemVM} from '../../../../../../../../../../../services/invoices/view-models/InvoiceItemVM';
import {CustomerDO} from '../../../../../../../../../../../services/customers/data-objects/CustomerDO';
import {InvoiceGroupControllerService} from '../../services/InvoiceGroupControllerService';
import {CustomScroll} from '../../../../../../../../../../../../../common/utils/directives/CustomScroll';

@Component({
    selector: 'invoice-edit',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/invoice-operations/components/invoice-edit/template/invoice-edit.html',
    directives: [InvoicePayerComponent, ThButtonComponent, CustomScroll],
    providers: [AddOnProductsModalService, CustomerRegisterModalService],
    pipes: [TranslationPipe]
})
export class InvoiceEditComponent implements OnInit {
    @Input() invoiceVMIndex: number;
    @Output() newlyAddedInvoiceRemoved = new EventEmitter();

    private _selectedInvoiceItemIndex: number;

    constructor(private _appContext: AppContext,
        private _addOnProductsModalService: AddOnProductsModalService,
        private _customerRegisterModalService: CustomerRegisterModalService,
        private _invoiceGroupControllerService: InvoiceGroupControllerService) {
	}

    ngOnInit() {
    }

    public openAddOnProductSelectModal() {
		this._addOnProductsModalService.openAddOnProductsModal().then((modalDialogInstance: ModalDialogRef<AddOnProductDO[]>) => {
			modalDialogInstance.resultObservable.subscribe((selectedAddOnProductList: AddOnProductDO[]) => {
				_.forEach(selectedAddOnProductList, (aop: AddOnProductDO) => {
					
				});
			});
		}).catch((e: any) => { });
	}

    public openCustomerSelectModal() {
        this._customerRegisterModalService.openCustomerRegisterModal(false).then((modalDialogInstance: ModalDialogRef<CustomerDO[]>) => {
            modalDialogInstance.resultObservable.subscribe((selectedCustomerList: CustomerDO[]) => {
                var newInvoicePayerVM = new InvoicePayerVM(this._appContext.thTranslation);
                newInvoicePayerVM.buildFromCustomerDO(selectedCustomerList[0]); 
                newInvoicePayerVM.newlyAdded = true;
                this.invoicePayerVMList.push(newInvoicePayerVM);
            });
        }).catch((e: any) => { });
    }

    public onDelete() {
        var title = this._appContext.thTranslation.translate("Remove Invoice");
        var content = this._appContext.thTranslation.translate("Are you sure you want to remove this recently added invoice?");
        var positiveLabel = this._appContext.thTranslation.translate("Yes");
        var negativeLabel = this._appContext.thTranslation.translate("No");
        this._appContext.modalService.confirm(title, content, { positive: positiveLabel, negative: negativeLabel }, () => {
            this.newlyAddedInvoiceRemoved.emit(this.invoiceVMIndex);
        });
    }

    public get ccySymbol(): string {
        return this.invoiceGroupVM.ccySymbol;
    }
    public get totalPrice(): number {
        return this.invoiceVM.totalPrice;
    }
    private get invoiceGroupVM(): InvoiceGroupVM {
        return this._invoiceGroupControllerService.invoiceGroupVM;
    }
    private get invoiceVM(): InvoiceVM {
        return this.invoiceGroupVM.invoiceVMList[this.invoiceVMIndex];
    }
    public get invoicePayerVMList(): InvoicePayerVM[] {
        return this.invoiceVM.invoicePayerVMList;
    }
    public get invoiceItemVMList(): InvoiceItemVM[] {
        return this.invoiceVM.invoceItemVMList;
    }

    public selectInvoiceItem(invoiceItemIndex: number) {
        if(!this.editMode || !this.invoiceItemVMList[invoiceItemIndex].isMovable()) {
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
}