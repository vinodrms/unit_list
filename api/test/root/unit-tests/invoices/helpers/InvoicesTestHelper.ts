import _ = require('underscore');
import { DefaultDataBuilder } from "../../../../db-initializers/DefaultDataBuilder";
import { InvoiceDO, InvoicePaymentStatus } from "../../../../../core/data-layer/invoices/data-objects/InvoiceDO";
import { InvoicePayerDO } from "../../../../../core/data-layer/invoices/data-objects/payer/InvoicePayerDO";
import { CustomerDO } from "../../../../../core/data-layer/customers/data-objects/CustomerDO";
import { InvoiceItemDO } from "../../../../../core/data-layer/invoices/data-objects/items/InvoiceItemDO";
import { TestUtils } from "../../../../helpers/TestUtils";
import { InvoicePaymentDO } from "../../../../../core/data-layer/invoices/data-objects/payer/InvoicePaymentDO";
import { InvoicePaymentMethodDO, InvoicePaymentMethodType } from "../../../../../core/data-layer/invoices/data-objects/payer/InvoicePaymentMethodDO";
import { TransactionFeeDO } from "../../../../../core/data-layer/common/data-objects/payment-method/TransactionFeeDO";

export class InvoicesTestHelper {
    private testUtils: TestUtils;
    constructor(private testDataBuilder: DefaultDataBuilder) {
        this.testUtils = new TestUtils();
    }

    getUnpaidInvoiceWithOnePayer(): InvoiceDO {
        let invoice = new InvoiceDO();
        invoice.hotelId = this.testDataBuilder.hotelDO.id;
        let payer = new InvoicePayerDO();
        let individual: CustomerDO = _.find(this.testDataBuilder.customerList, (customer: CustomerDO) => { return customer.isIndividual(); });
        payer.customerId = individual.id;
        invoice.payerList = [
            payer
        ];
        invoice.paymentStatus = InvoicePaymentStatus.Unpaid;
        return invoice;
    }

    getAddOnProductItem(): InvoiceItemDO {
        let addOnProduct = this.testUtils.getRandomListElement(this.testDataBuilder.addOnProductList);
        let invoiceItem = new InvoiceItemDO();
        invoiceItem.buildFromAddOnProductDO(addOnProduct, 3, addOnProduct.getVatId());
        return invoiceItem;
    }

    getPayment(amount: number): InvoicePaymentDO {
        let payment = new InvoicePaymentDO();
        payment.amount = amount;
        payment.amountPlusTransactionFee = amount;
        payment.notes = "test";
        payment.paymentMethod = new InvoicePaymentMethodDO();
        payment.paymentMethod.type = InvoicePaymentMethodType.DefaultPaymentMethod;
        payment.paymentMethod.value = this.testUtils.getRandomListElement(this.testDataBuilder.paymentMethodList).id;
        payment.shouldApplyTransactionFee = false;
        payment.transactionFeeSnapshot = TransactionFeeDO.getDefaultTransactionFee();
        return payment;
    }

    getUnpaidBookingInvoice(): InvoiceDO {
        return _.find(this.testDataBuilder.invoiceList, (invoice: InvoiceDO) => {
            return invoice.paymentStatus === InvoicePaymentStatus.Unpaid
                && !invoice.isWalkInInvoice();
        });
    }

    getUnpaidWalkInInvoice(): InvoiceDO {
        return _.find(this.testDataBuilder.invoiceList, (invoice: InvoiceDO) => {
            return invoice.paymentStatus === InvoicePaymentStatus.Unpaid
                && invoice.isWalkInInvoice();
        });
    }

    getUnpaidInvoiceWithNoItems(): InvoiceDO {
        return _.find(this.testDataBuilder.invoiceList, (invoice: InvoiceDO) => {
            return invoice.paymentStatus === InvoicePaymentStatus.Unpaid
                && invoice.itemList.length == 0
        });
    }

    getTotalPrice(items: InvoiceItemDO[]): number {
        let amount = 0.0;
        items.forEach(item => {
            amount += item.getTotalPrice();
        });
        return amount;
    }

}
