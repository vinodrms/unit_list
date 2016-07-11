import {HotelPaymentMethodsDO} from '../../../settings/data-objects/HotelPaymentMethodsDO';
import {PaymentMethodDO} from '../../../common/data-objects/payment-method/PaymentMethodDO';
import {InvoicePaymentMethodVM} from '../InvoicePaymentMethodVM';
import {CustomerDO} from '../../../customers/data-objects/CustomerDO';
import {InvoicePaymentMethodDO, InvoicePaymentMethodType} from '../../data-objects/payers/InvoicePaymentMethodDO';

export class InvoicePaymentMethodVMGenerator {
    constructor(private _allowedPaymentMethods: HotelPaymentMethodsDO) {
    }

    public generatePaymentMethodsFor(customer: CustomerDO): InvoicePaymentMethodVM[] {
        var paymentMethodList: InvoicePaymentMethodVM[] = [];
        if (customer.customerDetails.canPayInvoiceByAgreement()) {
            paymentMethodList.push(this.generatePayInvoiceByAgreementPaymentMethodVM());
            return paymentMethodList;
        }
        _.forEach(this._allowedPaymentMethods.paymentMethodList, (paymentMethod: PaymentMethodDO) => {
            paymentMethodList.push(this.generatePaymentMethodVMFor(paymentMethod));
        });
        return paymentMethodList;
    }
    private generatePayInvoiceByAgreementPaymentMethodVM(): InvoicePaymentMethodVM {
        var pmVM = new InvoicePaymentMethodVM();
        pmVM.displayName = "Pay Invoice By Agreement";
        pmVM.paymentMethod = new InvoicePaymentMethodDO();
        pmVM.paymentMethod.type = InvoicePaymentMethodType.PayInvoiceByAgreement;
        pmVM.paymentMethod.value = "";
        return pmVM;
    }
    private generatePaymentMethodVMFor(paymentMethod: PaymentMethodDO): InvoicePaymentMethodVM {
        var pmVM = new InvoicePaymentMethodVM();
        pmVM.displayName = paymentMethod.name;
        pmVM.paymentMethod = new InvoicePaymentMethodDO();
        pmVM.paymentMethod.type = InvoicePaymentMethodType.DefaultPaymentMethod;
        pmVM.paymentMethod.value = paymentMethod.id;
        return pmVM;
    }
}