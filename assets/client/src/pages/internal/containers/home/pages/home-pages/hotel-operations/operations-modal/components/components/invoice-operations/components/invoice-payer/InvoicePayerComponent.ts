import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {ThUtils} from '../../../../../../../../../../../../../common/utils/ThUtils';
import {AppContext, ThError} from '../../../../../../../../../../../../../common/utils/AppContext';
import {CustomerRegisterModalService} from '../../../../../../../../../../common/inventory/customer-register/modal/services/CustomerRegisterModalService';
import {CustomerDO} from '../../../../../../../../../../../services/customers/data-objects/CustomerDO';
import {ModalDialogRef} from '../../../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {InvoiceGroupControllerService} from '../../services/InvoiceGroupControllerService';
import {InvoiceDO} from '../../../../../../../../../../../services/invoices/data-objects/InvoiceDO';
import {InvoicePayerDO} from '../../../../../../../../../../../services/invoices/data-objects/payers/InvoicePayerDO';
import {InvoicePayerVM} from '../../../../../../../../../../../services/invoices/view-models/InvoicePayerVM';
import {InvoiceGroupVM} from '../../../../../../../../../../../services/invoices/view-models/InvoiceGroupVM';
import {InvoiceVM} from '../../../../../../../../../../../services/invoices/view-models/InvoiceVM';
import {InvoiceOperationsPageData} from '../../services/utils/InvoiceOperationsPageData';
import {HotelOperationsPageControllerService} from '../../../../services/HotelOperationsPageControllerService';

@Component({
    selector: 'invoice-payer',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/invoice-operations/components/invoice-payer/template/invoice-payer.html',
    directives: [],
    providers: [CustomerRegisterModalService],
    pipes: [TranslationPipe]
})
export class InvoicePayerComponent implements OnInit {
    @Input() invoiceVMIndex: number;
    @Input() invoicePayerVMIndex: number;

    private _thUtils: ThUtils;

    constructor(private _appContext: AppContext,
        private _customerRegisterModalService: CustomerRegisterModalService,
        private _invoiceGroupControllerService: InvoiceGroupControllerService,
        private _operationsPageControllerService: HotelOperationsPageControllerService) {

        this._thUtils = new ThUtils();
    }

    ngOnInit() {

    }

    public openCustomerSelectModal() {
        debugger
        this._customerRegisterModalService.openCustomerRegisterModal(false).then((modalDialogInstance: ModalDialogRef<CustomerDO[]>) => {
            modalDialogInstance.resultObservable.subscribe((selectedCustomerList: CustomerDO[]) => {
                var newInvoicePayer = new InvoicePayerDO();
                newInvoicePayer.customerId = selectedCustomerList[0].id;
                this.invoicePayerVM.invoicePayerDO = newInvoicePayer;
                this.invoicePayerVM.customerDO = selectedCustomerList[0];
            });
        }).catch((e: any) => { });
    }

    public goToCustomer(customer: CustomerDO) {
        this._operationsPageControllerService.goToCustomer(customer.id);
    }

    public onDelete() {
        var title = this._appContext.thTranslation.translate("Remove Payer");
        var content = this._appContext.thTranslation.translate("Are you sure you want to remove this recently added payer?");
        var positiveLabel = this._appContext.thTranslation.translate("Yes");
        var negativeLabel = this._appContext.thTranslation.translate("No");
        this._appContext.modalService.confirm(title, content, { positive: positiveLabel, negative: negativeLabel }, () => {
            this.invoiceVM.invoicePayerVMList.splice(this.invoicePayerVMIndex, 1);            
        });
    }

    public get ccySymbol(): string {
        return this.invoiceGroupVM.ccySymbol;
    }
    private get invoiceGroupVM(): InvoiceGroupVM {
        return this._invoiceGroupControllerService.invoiceGroupVM;
    }
    private get invoiceVM(): InvoiceVM {
        return this.invoiceGroupVM.invoiceVMList[this.invoiceVMIndex];
    }
    public get invoicePayerVM(): InvoicePayerVM {
        return this.invoiceVM.invoicePayerVMList[this.invoicePayerVMIndex];
    }
    public set invoicePayerVM(invoicePayerVM: InvoicePayerVM) {
        this.invoicePayerVM = invoicePayerVM;
    }
    public get totalAmount(): number {
        return this.invoiceVM.invoiceDO.getPrice();
    }
    public get editMode(): boolean {
        return this.invoiceGroupVM.editMode;
    }
    public get isNewlyAdded(): boolean {
        return this.invoicePayerVM.isNewlyAdded;
    }
}