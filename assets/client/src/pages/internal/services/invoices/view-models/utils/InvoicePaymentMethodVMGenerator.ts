import * as _ from "underscore";
import { HotelPaymentMethodsDO } from '../../../settings/data-objects/HotelPaymentMethodsDO';
import { PaymentMethodDO } from '../../../common/data-objects/payment-method/PaymentMethodDO';
import { InvoicePaymentMethodVM } from '../InvoicePaymentMethodVM';
import { CustomerDO } from '../../../customers/data-objects/CustomerDO';
import { InvoicePaymentMethodDO, InvoicePaymentMethodType } from '../../data-objects/payer/InvoicePaymentMethodDO';
import { HotelAggregatedPaymentMethodsDO } from "../../../settings/data-objects/HotelAggregatedPaymentMethodsDO";
import { AggregatedPaymentMethodDO } from "../../../common/data-objects/payment-method/AggregatedPaymentMethodDO";
import { TransactionFeeDO, TransactionFeeType } from "../../../common/data-objects/payment-method/TransactionFeeDO";

export class InvoicePaymentMethodVMGenerator {
    private _allowedPaymentMethodVMList: InvoicePaymentMethodVM[];

    constructor(private _allowedPaymentMethods: HotelAggregatedPaymentMethodsDO) {
        this.initAllowedInvoicePaymentMethodVMList();
    }
    private initAllowedInvoicePaymentMethodVMList() {
        this._allowedPaymentMethodVMList = _.map(this._allowedPaymentMethods.paymentMethodList, (paymentMethod: AggregatedPaymentMethodDO) => {
            return this.generateInvoicePaymentMethodVMFor(paymentMethod.paymentMethod);
        });
    }
    private generateInvoicePaymentMethodVMFor(paymentMethod: PaymentMethodDO): InvoicePaymentMethodVM {
        let foundAllowedPM = _.find(this._allowedPaymentMethods.paymentMethodList, (aggregatedPaymentMethodItem: AggregatedPaymentMethodDO) => {
            return aggregatedPaymentMethodItem.paymentMethod.id === paymentMethod.id;
        });
        var pmVM = new InvoicePaymentMethodVM();
        pmVM.displayName = paymentMethod.name;
        pmVM.iconUrl = paymentMethod.iconUrl;
        if (foundAllowedPM) {
            pmVM.transactionFee = foundAllowedPM.transactionFee;
        }
        pmVM.paymentMethod = new InvoicePaymentMethodDO();
        pmVM.paymentMethod.type = InvoicePaymentMethodType.DefaultPaymentMethod;
        pmVM.paymentMethod.value = paymentMethod.id;
        return pmVM;
    }

    public generatePaymentMethodsFor(customer: CustomerDO): InvoicePaymentMethodVM[] {
        if (customer.customerDetails.canPayInvoiceByAgreement()) {
            return [this.generatePayInvoiceByAgreementPaymentMethodVM(customer)].concat(this._allowedPaymentMethodVMList);
        }
        return this._allowedPaymentMethodVMList;
    }
    private generatePayInvoiceByAgreementPaymentMethodVM(customer: CustomerDO): InvoicePaymentMethodVM {
        var pmVM = new InvoicePaymentMethodVM();
        pmVM.displayName = "Pay Invoice By Agreement";
        pmVM.iconUrl = "fa-file-text-o";
        pmVM.transactionFee = new TransactionFeeDO();
        pmVM.transactionFee.amount = customer.customerDetails.getPayInvoiceByAgreementFee();
        pmVM.transactionFee.type = TransactionFeeType.Fixed;
        pmVM.paymentMethod = new InvoicePaymentMethodDO();
        pmVM.paymentMethod.type = InvoicePaymentMethodType.PayInvoiceByAgreement;
        pmVM.paymentMethod.value = "";
        return pmVM;
    }

    public generateInvoicePaymentMethodVMForPaymentMethod(invoicePaymentMethodDO: InvoicePaymentMethodDO,
        allPaymentMethods: HotelPaymentMethodsDO, customer: CustomerDO): InvoicePaymentMethodVM {
        if (invoicePaymentMethodDO.type === InvoicePaymentMethodType.PayInvoiceByAgreement) {
            return this.generatePayInvoiceByAgreementPaymentMethodVM(customer);
        }
        var foundPaymentMethodDO: PaymentMethodDO = _.find(allPaymentMethods.paymentMethodList, (paymentMethodDO: PaymentMethodDO) => {
            return paymentMethodDO.id === invoicePaymentMethodDO.value;
        });
        if (!foundPaymentMethodDO) {
            foundPaymentMethodDO = allPaymentMethods.paymentMethodList[0];
        }
        return this.generateInvoicePaymentMethodVMFor(foundPaymentMethodDO);
    }
}
