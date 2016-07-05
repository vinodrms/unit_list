import {ThUtils} from '../../../../../core/utils/ThUtils';
import {DefaultDataBuilder} from '../../../../db-initializers/DefaultDataBuilder';
import {TestUtils} from '../../../../helpers/TestUtils';
import {InvoiceGroupDO} from '../../../../../core/data-layer/invoices/data-objects/InvoiceGroupDO';
import {InvoiceDO, InvoicePaymentStatus} from '../../../../../core/data-layer/invoices/data-objects/InvoiceDO';
import {PayerDO} from '../../../../../core/data-layer/invoices/data-objects/payers/PayerDO';
import {InvoicePaymentMethodType, InvoicePaymentMethodDO} from '../../../../../core/data-layer/invoices/data-objects/payers/InvoicePaymentMethodDO';
import {InvoiceItemDO, InvoiceItemType} from '../../../../../core/data-layer/invoices/data-objects/items/InvoiceItemDO';
import {CommissionDO} from '../../../../../core/data-layer/common/data-objects/commission/CommissionDO';
import {CustomerType, CustomerDO} from '../../../../../core/data-layer/customers/data-objects/CustomerDO';
import {PaymentMethodDO} from '../../../../../core/data-layer/common/data-objects/payment-method/PaymentMethodDO';
import {CompanyDetailsDO} from '../../../../../core/data-layer/customers/data-objects/customer-details/corporate/CompanyDetailsDO';

export class InvoicesTestHelper {
    private _testUtils: TestUtils;
    private _thUtils: ThUtils;

    constructor(private _defaultDataBuilder: DefaultDataBuilder) {
        this._testUtils = new TestUtils();
        this._thUtils = new ThUtils();
    }

    // public getValidSaveInvoiceGroupItemDO(): SaveInvoiceGroupItemDO {
    //     return {
    //         bookingId: "123451231",
    //         indexedCustomerIdList: [],
    //         invoiceList: this.getInvoiceList(),
    //         paymentStatus: InvoicePaymentStatus.Open
    //     }
    // }

    // public getSaveInvoiceGroupItemDOFrom(invoiceGroup: InvoiceGroupDO): SaveInvoiceGroupItemDO {
    //     var result = {
    //         bookingId: invoiceGroup.bookingId,
    //         indexedCustomerIdList: invoiceGroup.indexedCustomerIdList,
    //         invoiceList: invoiceGroup.invoiceList,
    //         paymentStatus: invoiceGroup.paymentStatus
    //     };

    //     result["id"] = invoiceGroup.id;
    //     return result;
    // }
    
    private getInvoiceList(): InvoiceDO[] {
        var invoiceList = [];

        var firstInvoice = new InvoiceDO();
        firstInvoice.payerList = this.getPayerListForTheFirstInvoice();
        firstInvoice.itemList = this.getItemListForTheFirstInvoice();
        firstInvoice.paymentStatus = InvoicePaymentStatus.Open;

        var secondInvoice = new InvoiceDO();
        secondInvoice.payerList = this.getPayerListForTheSecondInvoice();
        secondInvoice.itemList = this.getItemListForTheSecondInvoice();
        secondInvoice.paymentStatus = InvoicePaymentStatus.Open;

        invoiceList.push(firstInvoice);
        invoiceList.push(secondInvoice);

        return invoiceList;
    }

    private getPayerListForTheFirstInvoice(): PayerDO[] {
        var payerList = [];

        var companies = this.getCompanyCustomers();
        var paymentMethods = this._defaultDataBuilder.hotelDO.paymentMethodIdList;

        if (companies.length > 0) {
            var payer = new PayerDO();
            payer.customerId = companies[0].id;
            var paymentMethod = new InvoicePaymentMethodDO();
            paymentMethod.type = InvoicePaymentMethodType.DefaultPaymentMethod;
            if (paymentMethods.length > 0) {
                paymentMethod.value = this._defaultDataBuilder.hotelDO.paymentMethodIdList[0];
            }
            payer.paymentMethod = paymentMethod;
            payer.priceToPay = 100;

            payerList.push(payer);
        }

        return payerList;
    }

    private getPayerListForTheSecondInvoice(): PayerDO[] {
        var payerList = [];

        var individuals = this.getIndividualCustomers();
        var paymentMethods = this._defaultDataBuilder.hotelDO.paymentMethodIdList;

        if (individuals.length >= 2) {
            var payerOne = new PayerDO();
            payerOne.customerId = individuals[0].id;
            var paymentMethodForPayerOne = new InvoicePaymentMethodDO();
            paymentMethodForPayerOne.type = InvoicePaymentMethodType.DefaultPaymentMethod;
            if (paymentMethods.length > 0) {
                paymentMethodForPayerOne.value = this._defaultDataBuilder.hotelDO.paymentMethodIdList[0];
            }
            payerOne.paymentMethod = paymentMethodForPayerOne;
            payerOne.priceToPay = 100;

            var payerTwo = new PayerDO();
            payerTwo.customerId = individuals[1].id;
            var paymentMethodForPayerTwo = new InvoicePaymentMethodDO();
            paymentMethodForPayerTwo.type = InvoicePaymentMethodType.DefaultPaymentMethod;
            if (paymentMethods.length > 1) {
                paymentMethodForPayerTwo.value = this._defaultDataBuilder.hotelDO.paymentMethodIdList[1];
            }
            payerTwo.paymentMethod = paymentMethodForPayerTwo;
            payerTwo.priceToPay = 200;

            payerList.push(payerOne);
            payerList.push(payerTwo);
        }

        return payerList;
    }

    private getItemListForTheFirstInvoice(): InvoiceItemDO[] {
        var itemList = [];

        var priceProductList = this._defaultDataBuilder.priceProductList;
        if (priceProductList.length > 0) {
            var ppInvoiceItem = new InvoiceItemDO();
            ppInvoiceItem.id = priceProductList[0].id;
            ppInvoiceItem.type = InvoiceItemType.PriceProduct;
            ppInvoiceItem.qty = 1;
            itemList.push(ppInvoiceItem);
        }

        return itemList;
    }

    private getItemListForTheSecondInvoice(): InvoiceItemDO[] {
        var itemList = [];

        var addOnProductList = this._defaultDataBuilder.addOnProductList;
        
        if (addOnProductList.length > 1) {
            var aopInvoiceItemOne = new InvoiceItemDO();
            aopInvoiceItemOne.id = addOnProductList[0].id;
            aopInvoiceItemOne.type = InvoiceItemType.AddOnProduct;
            aopInvoiceItemOne.qty = -1;
            var aopInvoiceItemTwo = new InvoiceItemDO();
            aopInvoiceItemTwo.id = addOnProductList[1].id;
            aopInvoiceItemTwo.type = InvoiceItemType.AddOnProduct;
            aopInvoiceItemTwo.qty = 2;

            itemList.push(aopInvoiceItemOne);
            itemList.push(aopInvoiceItemTwo);
        }

        return itemList;
    }

    private getIndividualCustomers(): CustomerDO[] {
        return _.filter(this._defaultDataBuilder.customerList, ((customer: CustomerDO) => {
            return customer.type === CustomerType.Individual;
        }));
    }

    private getCompanyCustomers(): CustomerDO[] {
        return _.filter(this._defaultDataBuilder.customerList, ((customer: CustomerDO) => {
            return customer.type === CustomerType.Company;
        }));
    }
}