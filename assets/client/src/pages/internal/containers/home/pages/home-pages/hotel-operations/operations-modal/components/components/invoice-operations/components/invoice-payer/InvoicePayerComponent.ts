import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {AppContext, ThError} from '../../../../../../../../../../../../../common/utils/AppContext';
import {CustomerRegisterModalService} from '../../../../../../../../../../common/inventory/customer-register/modal/services/CustomerRegisterModalService';
import {CustomerDO} from '../../../../../../../../../../../services/customers/data-objects/CustomerDO';
import {ModalDialogRef} from '../../../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {InvoiceGroupControllerService} from '../../services/InvoiceGroupControllerService';
import {InvoiceDO} from '../../../../../../../../../../../services/invoices/data-objects/InvoiceDO';
import {InvoicePayerDO} from '../../../../../../../../../../../services/invoices/data-objects/payers/InvoicePayerDO';
import {InvoicePayerVM} from '../../../../../../../../../../../services/invoices/view-models/InvoicePayerVM';
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
    @Input() invoiceIndex: number;
    @Input() invoicePayerIndex: number;
    
    private _invoicePayerVM: InvoicePayerVM;

    constructor(private _customerRegisterModalService: CustomerRegisterModalService,
        private _invoiceGroupControllerService: InvoiceGroupControllerService,
        private _operationsPageControllerService: HotelOperationsPageControllerService) {
	}

    ngOnInit() {
        this._invoicePayerVM = new InvoicePayerVM();
        this._invoicePayerVM.invoicePayerDO = this.invoicePayerDO;
        this._invoicePayerVM.customerDO = this.invoiceOperationsPageData.customersContainer.getCustomerById(this.invoicePayerDO.customerId);
        this._invoicePayerVM.invoiceDO = this.invoiceDO;
        this._invoicePayerVM.ccy = this.invoiceOperationsPageData.ccy;
    }

    public openCustomerSelectModal() {
        this._customerRegisterModalService.openCustomerRegisterModal(false).then((modalDialogInstance: ModalDialogRef<CustomerDO[]>) => {
            modalDialogInstance.resultObservable.subscribe((selectedCustomerList: CustomerDO[]) => {
                this._invoicePayerVM.customerDO = selectedCustomerList[0];
                this._invoicePayerVM.invoicePayerDO = new InvoicePayerDO();
                this._invoicePayerVM.invoicePayerDO.customerId = this._invoicePayerVM.customerDO.id;
                this.invoicePayerDO = this._invoicePayerVM.invoicePayerDO;
                console.log(this.invoicePayerVM.customerDO.customerName);
                debugger
            });
        }).catch((e: any) => { });
    }

    public goToCustomer(customer: CustomerDO) {
        this._operationsPageControllerService.goToCustomer(customer.id);
    }

    private get invoiceOperationsPageData(): InvoiceOperationsPageData {
        return this._invoiceGroupControllerService.invoiceOperationsPageData;
    }
    private get invoiceDO(): InvoiceDO {
        return this.invoiceOperationsPageData.invoiceGroupDO.invoiceList[this.invoiceIndex];
    } 
    private get invoicePayerDO(): InvoicePayerDO {
         return this.invoiceDO.payerList[this.invoicePayerIndex];
    }
    private set invoicePayerDO(invoicePayerDO: InvoicePayerDO) {
        this.invoiceDO.payerList[this.invoicePayerIndex] = invoicePayerDO;
    }
    public get invoicePayerVM(): InvoicePayerVM {
        return this._invoicePayerVM;
    }
}