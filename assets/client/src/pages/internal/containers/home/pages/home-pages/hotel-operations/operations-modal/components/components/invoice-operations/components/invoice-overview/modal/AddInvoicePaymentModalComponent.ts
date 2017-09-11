import { Component, OnInit } from '@angular/core';
import { BaseComponent } from "../../../../../../../../../../../../../../common/base/BaseComponent";
import { ICustomModalComponent, ModalSize } from "../../../../../../../../../../../../../../common/utils/modals/utils/ICustomModalComponent";
import { ModalDialogRef } from "../../../../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef";
import { InvoicePaymentDO } from "../../../../../../../../../../../../services/invoices/data-objects/payer/InvoicePaymentDO";
import { AppContext } from "../../../../../../../../../../../../../../common/utils/AppContext";
import { AddInvoicePaymentModalInput } from "./services/utils/AddInvoicePaymentModalInput";
import { InvoicePaymentMethodDO } from "../../../../../../../../../../../../services/invoices/data-objects/payer/InvoicePaymentMethodDO";
import { InvoicePaymentMethodVMGenerator } from "../../../../../../../../../../../../services/invoices/view-models/utils/InvoicePaymentMethodVMGenerator";
import { InvoicePaymentMethodVM } from "../../../../../../../../../../../../services/invoices/view-models/InvoicePaymentMethodVM";
import { ThUtils } from "../../../../../../../../../../../../../../common/utils/ThUtils";
import { TransactionFeeDO, TransactionFeeType } from "../../../../../../../../../../../../services/common/data-objects/payment-method/TransactionFeeDO";


@Component({
    selector: 'add-invoice-payment-modal',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/invoice-operations/components/invoice-overview/modal/templates/add-invoice-payment-modal.html'
})
export class AddInvoicePaymentModalComponent extends BaseComponent implements ICustomModalComponent {

    public applyFee: boolean = false;
    public selectedInvoicePaymentMethodVM: InvoicePaymentMethodVM;
    public paymentAmount: number;
    public paymentNotes: string;

    private _pmGenerator: InvoicePaymentMethodVMGenerator;
    private _customerPaymentMethodVMList: InvoicePaymentMethodVM[];
    private _invoicePayment: InvoicePaymentDO;
    private _thUtils: ThUtils;

    constructor(private _modalDialogRef: ModalDialogRef<InvoicePaymentDO>,
        private _appContext: AppContext,
        private _modalInput: AddInvoicePaymentModalInput) {
        super();
        this._thUtils = new ThUtils();
    }

    ngOnInit() {
        this.paymentAmount = this._modalInput.invoiceAmountLeftToPay;
        this._pmGenerator = new InvoicePaymentMethodVMGenerator(this._modalInput.invoiceOperationsPageData.allowedPaymentMethods);
        this._customerPaymentMethodVMList = this._pmGenerator.generatePaymentMethodsFor(this._modalInput.customer);
        this.selectedInvoicePaymentMethodVM = this._customerPaymentMethodVMList[0];
    }

    public closeDialog(closeWithoutConfirmation: boolean) {
        this._modalDialogRef.closeForced();
    }

    public addInvoicePayment() {
        if (this._thUtils.isUndefinedOrNull(this.paymentAmount)) {
            let errorMessage = this._appContext.thTranslation.translate("Please add a payment amount.");
            this._appContext.toaster.error(errorMessage);
            return;
        }
        if (this.paymentAmount <= 0 || this.paymentAmount > this._modalInput.invoiceAmountLeftToPay) {
            let errorMessage = this._appContext.thTranslation.translate("Please select a payment amount lower or equal to the amount left to pay.");
            this._appContext.toaster.error(errorMessage);
            return;
        }
        var invoicePaymentDO = new InvoicePaymentDO();
        //invoicePaymentDO.amount = this._thUtils.roundNumberToTwoDecimals(this.paymentAmount);
        invoicePaymentDO.amount = this.paymentAmount;
        invoicePaymentDO.paymentMethod = this.selectedInvoicePaymentMethodVM.paymentMethod;
        invoicePaymentDO.shouldApplyTransactionFee = this.applyFee;
        if (!this.applyFee) {
            invoicePaymentDO.transactionFeeSnapshot = TransactionFeeDO.getDefaultTransactionFee();
        } else {
            invoicePaymentDO.transactionFeeSnapshot = this.selectedInvoicePaymentMethodVM.transactionFee;
        }
        invoicePaymentDO.amountPlusTransactionFee = invoicePaymentDO.transactionFeeSnapshot.getAmountWithTransactionFeeIncluded(invoicePaymentDO.amount);
        invoicePaymentDO.notes = this.paymentNotes;
        this._modalDialogRef.addResult(invoicePaymentDO);
        this._modalDialogRef.closeForced();
    }

    public isBlocking(): boolean {
        return true;
    }
    public getSize(): ModalSize {
        return ModalSize.Medium;
    }

    public get maxPaymentAmountString(): string {
        return this.ccySymbol + this._modalInput.invoiceAmountLeftToPay;
    }

    public get ccySymbol(): string {
        return this._modalInput.invoiceOperationsPageData.ccy.symbol;
    }

    public get customerPaymentMethodVMList(): InvoicePaymentMethodVM[] {
        return this._customerPaymentMethodVMList;
    }

    public didChangeInvoicePaymentMethod(invoicePaymentMethodVM: InvoicePaymentMethodVM) {
        this.selectedInvoicePaymentMethodVM = invoicePaymentMethodVM;
    }

    public get transactionFeeIsFixed(): boolean {
        return this.selectedInvoicePaymentMethodVM.transactionFee.type === TransactionFeeType.Fixed;
    }
    public get transactionFee(): TransactionFeeDO {
        return this.selectedInvoicePaymentMethodVM.transactionFee;
    }
    private get priceToPayPlusTransactionFee(): number {
        if (!this.applyFee || !this.paymentAmount) {
            return this.paymentAmount;
        }

        return this.selectedInvoicePaymentMethodVM.transactionFee.getAmountWithTransactionFeeIncluded(this.paymentAmount);
    }
}
