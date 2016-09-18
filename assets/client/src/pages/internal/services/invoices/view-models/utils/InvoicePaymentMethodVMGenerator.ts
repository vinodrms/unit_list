import {HotelPaymentMethodsDO} from '../../../settings/data-objects/HotelPaymentMethodsDO';
import {PaymentMethodDO} from '../../../common/data-objects/payment-method/PaymentMethodDO';
import {InvoicePaymentMethodVM} from '../InvoicePaymentMethodVM';
import {CustomerDO} from '../../../customers/data-objects/CustomerDO';
import {InvoicePaymentMethodDO, InvoicePaymentMethodType} from '../../data-objects/payers/InvoicePaymentMethodDO';

export class InvoicePaymentMethodVMGenerator {
    private _allowedPaymentMethodVMList: InvoicePaymentMethodVM[];

    constructor(private _allowedPaymentMethods: HotelPaymentMethodsDO) {
        this.initAllowedInvoicePaymentMethodVMList();
    }
    private initAllowedInvoicePaymentMethodVMList() {
        this._allowedPaymentMethodVMList = _.map(this._allowedPaymentMethods.paymentMethodList, (paymentMethod: PaymentMethodDO) => {
            return this.generatePaymentMethodVMFor(paymentMethod);
        });
    }

    public generatePaymentMethodsFor(customer: CustomerDO): InvoicePaymentMethodVM[] {
        if (customer.customerDetails.canPayInvoiceByAgreement()) {
            return [this.generatePayInvoiceByAgreementPaymentMethodVM()];
        }
        return this._allowedPaymentMethodVMList;
    }
    public generateInvoicePaymentMethodsFor(customer: CustomerDO): InvoicePaymentMethodVM[] {
        var paymentMethodList: InvoicePaymentMethodVM[] = [];
        if (customer.customerDetails.canPayInvoiceByAgreement()) {
            paymentMethodList.push(this.generatePayInvoiceByAgreementPaymentMethodVM());
        }
        return paymentMethodList.concat(this._allowedPaymentMethodVMList);
    }
    private generatePayInvoiceByAgreementPaymentMethodVM(): InvoicePaymentMethodVM {
        var pmVM = new InvoicePaymentMethodVM();
        pmVM.displayName = "Pay Invoice By Agreement";
        pmVM.iconUrl = "fa-file-text-o";
        pmVM.paymentMethod = new InvoicePaymentMethodDO();
        pmVM.paymentMethod.type = InvoicePaymentMethodType.PayInvoiceByAgreement;
        pmVM.paymentMethod.value = "";
        return pmVM;
    }
    private generatePaymentMethodVMFor(paymentMethod: PaymentMethodDO): InvoicePaymentMethodVM {
        var pmVM = new InvoicePaymentMethodVM();
        pmVM.displayName = paymentMethod.name;
        pmVM.iconUrl = paymentMethod.iconUrl;
        pmVM.paymentMethod = new InvoicePaymentMethodDO();
        pmVM.paymentMethod.type = InvoicePaymentMethodType.DefaultPaymentMethod;
        pmVM.paymentMethod.value = paymentMethod.id;
        return pmVM;
    }
    public generatePaymentMethodVMForPaymentMethod(invoicePaymentMethodDO: InvoicePaymentMethodDO, allPaymentMethods: HotelPaymentMethodsDO): InvoicePaymentMethodVM {
        if (invoicePaymentMethodDO.type === InvoicePaymentMethodType.PayInvoiceByAgreement) {
            return this.generatePayInvoiceByAgreementPaymentMethodVM();
        }
        var foundPaymentMethodDO: PaymentMethodDO = _.find(allPaymentMethods.paymentMethodList, (paymentMethodDO: PaymentMethodDO) => {
            return paymentMethodDO.id === invoicePaymentMethodDO.value;
        });
        if (!foundPaymentMethodDO) {
            foundPaymentMethodDO = allPaymentMethods.paymentMethodList[0];
        }
        return this.generatePaymentMethodVMFor(foundPaymentMethodDO);
    }
}