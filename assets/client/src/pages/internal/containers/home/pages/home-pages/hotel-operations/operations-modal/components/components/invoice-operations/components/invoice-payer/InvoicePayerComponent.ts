import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {ThUtils} from '../../../../../../../../../../../../../common/utils/ThUtils';
import {AppContext, ThError} from '../../../../../../../../../../../../../common/utils/AppContext';
import {CustomerRegisterModalService} from '../../../../../../../../../../common/inventory/customer-register/modal/services/CustomerRegisterModalService';
import {CustomerDO} from '../../../../../../../../../../../services/customers/data-objects/CustomerDO';
import {ModalDialogRef} from '../../../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {InvoiceGroupControllerService} from '../../services/InvoiceGroupControllerService';
import {InvoiceDO} from '../../../../../../../../../../../services/invoices/data-objects/InvoiceDO';
import {BookingDO} from '../../../../../../../../../../../services/bookings/data-objects/BookingDO';
import {InvoicePayerDO} from '../../../../../../../../../../../services/invoices/data-objects/payers/InvoicePayerDO';
import {InvoicePayerVM} from '../../../../../../../../../../../services/invoices/view-models/InvoicePayerVM';
import {InvoiceGroupVM} from '../../../../../../../../../../../services/invoices/view-models/InvoiceGroupVM';
import {InvoiceVM} from '../../../../../../../../../../../services/invoices/view-models/InvoiceVM';
import {InvoiceOperationsPageData} from '../../services/utils/InvoiceOperationsPageData';
import {HotelOperationsPageControllerService} from '../../../../services/HotelOperationsPageControllerService';
import {InvoicePaymentMethodVMGenerator} from '../../../../../../../../../../../services/invoices/view-models/utils/InvoicePaymentMethodVMGenerator';
import {InvoicePaymentMethodVM} from '../../../../../../../../../../../services/invoices/view-models/InvoicePaymentMethodVM';
import {InvoicePaymentMethodDO, InvoicePaymentMethodType} from '../../../../../../../../../../../services/invoices/data-objects/payers/InvoicePaymentMethodDO';

@Component({
    selector: 'invoice-payer',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/invoice-operations/components/invoice-payer/template/invoice-payer.html',
    directives: [],
    providers: [CustomerRegisterModalService],
    pipes: [TranslationPipe]
})
export class InvoicePayerComponent implements OnInit {
    @Input() invoiceReference: string;
    @Input() invoicePayerVMIndex: number;

    paymentMethodVMList: InvoicePaymentMethodVM[] = [];
    private _selectedPaymentMethodVM: InvoicePaymentMethodVM;

    private _thUtils: ThUtils;
    private _pmGenerator: InvoicePaymentMethodVMGenerator;

    constructor(private _appContext: AppContext,
        private _customerRegisterModalService: CustomerRegisterModalService,
        private _invoiceGroupControllerService: InvoiceGroupControllerService,
        private _operationsPageControllerService: HotelOperationsPageControllerService) {

        this._thUtils = new ThUtils();
    }

    public get selectedPaymentMethodVM(): InvoicePaymentMethodVM {
        return this._selectedPaymentMethodVM;
    }

    public set selectedPaymentMethodVM(selectedPaymentMethodVM: InvoicePaymentMethodVM) {
        this._selectedPaymentMethodVM = selectedPaymentMethodVM;
        this.invoiceVM.isValid();
    }

    ngOnInit() {
        this._pmGenerator = new InvoicePaymentMethodVMGenerator(this._invoiceGroupControllerService.invoiceOperationsPageData.allowedPaymentMethods);
        if (this.customerWasSelected()) {
            this.paymentMethodVMList = this.generatePaymentMethodsFor(this.invoicePayerVM.customerDO);
            if (this.paymentMethodWasSelected()) {
                this.selectedPaymentMethodVM =
                    _.find(this.paymentMethodVMList, (paymentMethodVM: InvoicePaymentMethodVM) => {
                        return paymentMethodVM.paymentMethod.isSame(this.invoicePayerVM.invoicePayerDO.paymentMethod);
                    });
            }
            else {
                this.selectedPaymentMethodVM = this.paymentMethodVMList[0];
            }
            this.invoicePayerVM.invoicePayerDO.paymentMethod = this.selectedPaymentMethodVM.paymentMethod;
        }
    }

    private customerWasSelected(): boolean {
        return !this._thUtils.isUndefinedOrNull(this.invoicePayerVM.customerDO);
    }

    private paymentMethodWasSelected(): boolean {
        return !this._thUtils.isUndefinedOrNull(this.invoicePayerVM.invoicePayerDO.paymentMethod);
    }

    public openCustomerSelectModal() {

        this._customerRegisterModalService.openCustomerRegisterModal(false).then((modalDialogInstance: ModalDialogRef<CustomerDO[]>) => {
            modalDialogInstance.resultObservable.subscribe((selectedCustomerList: CustomerDO[]) => {
                var selectedCustomer = selectedCustomerList[0];

                this._invoiceGroupControllerService.invoiceOperationsPageData.customersContainer.appendCustomer(selectedCustomer);

                var newInvoicePayer = new InvoicePayerDO();
                newInvoicePayer.customerId = selectedCustomer.id;

                if (newInvoicePayer.priceToPay === 0 && this.invoiceVM.invoicePayerVMList.length === 1) {
                    newInvoicePayer.priceToPay = 0.0;
                    // TODO: check -> this.invoiceVM.invoiceDO.getRemainingAmountToBePaid();
                }
                else {
                    newInvoicePayer.priceToPay = this.invoicePayerVM.invoicePayerDO.priceToPay;
                }

                this.paymentMethodVMList = this.generatePaymentMethodsFor(selectedCustomer);
                this.selectedPaymentMethodVM = this.paymentMethodVMList[0];
                newInvoicePayer.paymentMethod = this.paymentMethodVMList[0].paymentMethod;
                this.invoicePayerVM.invoicePayerDO = newInvoicePayer;
                this.invoicePayerVM.customerDO = selectedCustomer;
                this.invoiceVM.isValid();
            });
        }).catch((e: any) => {
        });
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
            this.invoiceVM.isValid();
        });
    }
    public get ccySymbol(): string {
        return this.invoiceGroupVM.ccySymbol;
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

    private generatePaymentMethodsFor(customer: CustomerDO): InvoicePaymentMethodVM[] {
        var invoicePaymentMethodVMList = this._pmGenerator.generateInvoicePaymentMethodsFor(customer);

        if (customer.isCompanyOrTravelAgency()) {
            var bookingDO = _.find(this._invoiceGroupControllerService.invoiceOperationsPageData.bookingsContainer.bookingList, (booking: BookingDO) => {
                return booking.bookingId === this.invoiceVM.invoiceDO.bookingId;
            });

            if (customer.hasAccessOnPriceProduct(bookingDO.priceProductSnapshot)) {
                return invoicePaymentMethodVMList;
            }
        }

        var index = _.findIndex(invoicePaymentMethodVMList, (invoicePaymentMethodVM: InvoicePaymentMethodVM) => {
            return invoicePaymentMethodVM.paymentMethod.type === InvoicePaymentMethodType.PayInvoiceByAgreement;
        });
        if (index != -1) {
            invoicePaymentMethodVMList.splice(index, 1);
        }
        return invoicePaymentMethodVMList;
    }
}