import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ThUtils } from '../../../../../../../../../../../../../common/utils/ThUtils';
import { AppContext, ThError } from '../../../../../../../../../../../../../common/utils/AppContext';
import { CustomerRegisterModalService } from '../../../../../../../../../../common/inventory/customer-register/modal/services/CustomerRegisterModalService';
import { CustomerDO } from '../../../../../../../../../../../services/customers/data-objects/CustomerDO';
import { ModalDialogRef } from '../../../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import { InvoiceGroupControllerService } from '../../services/InvoiceGroupControllerService';
import { InvoiceDO } from '../../../../../../../../../../../services/invoices/data-objects/InvoiceDO';
import { BookingDO } from '../../../../../../../../../../../services/bookings/data-objects/BookingDO';
import { InvoicePayerDO } from '../../../../../../../../../../../services/invoices/data-objects/payers/InvoicePayerDO';
import { InvoicePayerVM } from '../../../../../../../../../../../services/invoices/view-models/InvoicePayerVM';
import { InvoiceGroupVM } from '../../../../../../../../../../../services/invoices/view-models/InvoiceGroupVM';
import { InvoiceVM } from '../../../../../../../../../../../services/invoices/view-models/InvoiceVM';
import { InvoiceOperationsPageData } from '../../services/utils/InvoiceOperationsPageData';
import { HotelOperationsPageControllerService } from '../../../../services/HotelOperationsPageControllerService';
import { InvoicePaymentMethodVMGenerator } from '../../../../../../../../../../../services/invoices/view-models/utils/InvoicePaymentMethodVMGenerator';
import { InvoicePaymentMethodVM } from '../../../../../../../../../../../services/invoices/view-models/InvoicePaymentMethodVM';
import { InvoicePaymentMethodDO, InvoicePaymentMethodType } from '../../../../../../../../../../../services/invoices/data-objects/payers/InvoicePaymentMethodDO';
import { EmailSenderModalService } from '../../../../../../email-sender/services/EmailSenderModalService';
import { TransactionFeeDO, TransactionFeeType } from "../../../../../../../../../../../services/common/data-objects/payment-method/TransactionFeeDO";

@Component({
    selector: 'invoice-payer',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/invoice-operations/components/invoice-payer/template/invoice-payer.html',
    providers: [CustomerRegisterModalService, EmailSenderModalService]
})
export class InvoicePayerComponent implements OnInit {
    @Input() invoiceUniqueId: string;
    @Input() invoicePayerVMIndex: number;

    paymentMethodVMList: InvoicePaymentMethodVM[] = [];
    private _selectedPaymentMethodVM: InvoicePaymentMethodVM;

    private _thUtils: ThUtils;
    private _pmGenerator: InvoicePaymentMethodVMGenerator;

    private _pmWasSetForTheFirstTime = false;

    constructor(private _appContext: AppContext,
        private _emailSenderModalService: EmailSenderModalService,
        private _customerRegisterModalService: CustomerRegisterModalService,
        private _invoiceGroupControllerService: InvoiceGroupControllerService,
        private _operationsPageControllerService: HotelOperationsPageControllerService) {

        this._thUtils = new ThUtils();
    }

    public get selectedPaymentMethodVM(): InvoicePaymentMethodVM {``
        return this._selectedPaymentMethodVM;
    }

    public set selectedPaymentMethodVM(selectedPaymentMethodVM: InvoicePaymentMethodVM) {
        this._selectedPaymentMethodVM = selectedPaymentMethodVM;
        this.invoicePayerVM.invoicePayerDO.paymentMethod = selectedPaymentMethodVM.paymentMethod;
        if (this._pmWasSetForTheFirstTime) {
            this.invoiceVM.addOrRemoveInvoiceFeeIfNecessary(this._invoiceGroupControllerService.invoiceOperationsPageData.customersContainer.customerList);
            this.invoiceGroupVM.updatePriceToPayIfSinglePayerByUniqueIdentifier(this.invoiceUniqueId);
            this.invoiceVM.isValid();
        }
        if (!this._pmWasSetForTheFirstTime) this._pmWasSetForTheFirstTime = true;

        if(selectedPaymentMethodVM.paymentMethod.type === InvoicePaymentMethodType.PayInvoiceByAgreement) {
            this.transactionFee = TransactionFeeDO.getDefaultTransactionFee();
        }
        
        this.invoicePayerVM.invoicePayerDO.transactionFeeSnapshot = this.transactionFee;
        
        this.invoicePayerVM.invoicePayerDO.priceToPayPlusTransactionFee = 
            this.invoicePayerVM.invoicePayerDO.transactionFeeSnapshot.getAmountWihtTransactionFeeIncluded(this.invoicePayerVM.invoicePayerDO.priceToPay);
    }

    ngOnInit() {
        this._pmGenerator = new InvoicePaymentMethodVMGenerator(this._invoiceGroupControllerService.invoiceOperationsPageData.allowedPaymentMethods);
        if (this.customerWasSelected()) {
            this.paymentMethodVMList = this.generatePaymentMethodsFor(this.invoicePayerVM.customerDO);
            if (this.paymentMethodWasSelected()) {
                this.updateSelectedPaymentMethodVM();
            }
            else {
                this.selectedPaymentMethodVM = this.paymentMethodVMList[0];
            }
            this.invoicePayerVM.invoicePayerDO.paymentMethod = this.selectedPaymentMethodVM.paymentMethod;
        }
    }
    private updateSelectedPaymentMethodVM() {
        var selectedPaymentMethodVM = _.find(this.paymentMethodVMList, (paymentMethodVM: InvoicePaymentMethodVM) => {
            return paymentMethodVM.paymentMethod.isSame(this.invoicePayerVM.invoicePayerDO.paymentMethod);
        });
        if (this._thUtils.isUndefinedOrNull(selectedPaymentMethodVM)) {
            let allPaymentMethods = this._invoiceGroupControllerService.invoiceOperationsPageData.allPaymentMethods;
            let selectedPaymentMethod = this.invoicePayerVM.invoicePayerDO.paymentMethod;
            selectedPaymentMethodVM = this._pmGenerator.generateInvoicePaymentMethodVMForPaymentMethod(selectedPaymentMethod, allPaymentMethods);
        }
        this.selectedPaymentMethodVM = selectedPaymentMethodVM;
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

                if (this.invoiceVM.invoiceDO.isWalkInInvoice() && !selectedCustomer.canCreateWalkInInvoices()) {
                    let errorMessage = this._appContext.thTranslation.translate("You cannot create walk in invoices for customers with Pay Invoice By Agreement enabled.");
                    this._appContext.toaster.error(errorMessage);
                    return;
                }

                this._invoiceGroupControllerService.invoiceOperationsPageData.customersContainer.appendCustomer(selectedCustomer);

                var newInvoicePayer = new InvoicePayerDO();
                newInvoicePayer.customerId = selectedCustomer.id;

                this.paymentMethodVMList = this.generatePaymentMethodsFor(selectedCustomer);
                this.selectedPaymentMethodVM = this.paymentMethodVMList[0];
                newInvoicePayer.paymentMethod = this.paymentMethodVMList[0].paymentMethod;
                
                if (this.invoiceVM.invoicePayerVMList.length === 1) {
                    newInvoicePayer.priceToPay = this.invoicePayerVM.invoicePayerDO.priceToPay;
                    newInvoicePayer.transactionFeeSnapshot = this.selectedPaymentMethodVM.transactionFee;
                    newInvoicePayer.priceToPayPlusTransactionFee = newInvoicePayer.transactionFeeSnapshot.getAmountWihtTransactionFeeIncluded(newInvoicePayer.priceToPay);
                }
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

    public get invoicePdfUrl(): string {
        return 'api/invoiceGroups/pdf?invoiceGroupId='
            + this.invoiceGroupVM.invoiceGroupDO.id + '&invoiceId='
            + this.invoiceVM.invoiceDO.id + '&customerId=' + this.invoicePayerVM.customerDO.id
            + '&payerIndex=' + this.invoicePayerVMIndex;
    }

    public onSend() {
        this._emailSenderModalService.sendInvoiceConfirmation([this.invoicePayerVM.customerDO],
            this.invoiceGroupVM.invoiceGroupDO.id,
            this.invoiceVM.invoiceDO.id,
            this.invoicePayerVM.customerDO.id,
            this.invoicePayerVMIndex).then((modalDialogRef: ModalDialogRef<boolean>) => {
                modalDialogRef.resultObservable.subscribe((sendResult: boolean) => {
                    this._appContext.analytics.logEvent("invoice", "send-confirmation", "Sent an invoice confirmation by email");
                }, (err: any) => { });
            }).catch((err: any) => { });
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
            if (this.invoiceGroupVM.invoiceVMList[i].invoiceDO.uniqueIdentifierEquals(this.invoiceUniqueId)) {
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
    public get totalAmountWithTransactionFee(): number {
        return this.transactionFee.getAmountWihtTransactionFeeIncluded(this.invoicePayerVM.invoicePayerDO.priceToPay);
    }
    public get transactionFee(): TransactionFeeDO {
        return this.selectedPaymentMethodVM.transactionFee;
    }
    public set transactionFee(transactionFee: TransactionFeeDO) {
        this.selectedPaymentMethodVM.transactionFee = transactionFee;
    }
    public get transactionFeeIsFixed(): boolean {
        return this.selectedPaymentMethodVM.transactionFee.type === TransactionFeeType.Fixed;
    }
    public get editMode(): boolean {
        return this.invoiceGroupVM.editMode;
    }

    private generatePaymentMethodsFor(customer: CustomerDO): InvoicePaymentMethodVM[] {
        var invoicePaymentMethodVMList = this._pmGenerator.generateInvoicePaymentMethodsFor(customer);

        if (customer.isCompanyOrTravelAgency()) {
            var bookingDO = _.find(this._invoiceGroupControllerService.invoiceOperationsPageData.bookingsContainer.bookingList, (booking: BookingDO) => {
                return booking.id === this.invoiceVM.invoiceDO.bookingId;
            });

            if (!this._appContext.thUtils.isUndefinedOrNull(bookingDO) && customer.hasAccessOnPriceProduct(bookingDO.priceProductSnapshot)) {
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

    public get invoiceisPaid(): boolean {
        return this.invoiceVM.invoiceDO.isPaid;
    }
    public get invoiceIsClosed(): boolean {
        return this.invoiceVM.invoiceDO.isClosed;
    }
}