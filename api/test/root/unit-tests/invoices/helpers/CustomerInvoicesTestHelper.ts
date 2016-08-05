import {ThUtils} from '../../../../../core/utils/ThUtils';
import {DefaultDataBuilder} from '../../../../db-initializers/DefaultDataBuilder';
import {TestUtils} from '../../../../helpers/TestUtils';

import {SaveInvoiceGroupBuilder} from '../builders/SaveInvoiceGroupBuilder';
import {SaveInvoiceGroupDO} from '../../../../../core/domain-layer/invoices/save-invoice-group/SaveInvoiceGroupDO';
import {InvoiceBuilder} from '../builders/InvoiceBuilder';
import {InvoiceItemBuilder} from '../builders/InvoiceItemBuilder';
import {InvoicePayerBuilder} from '../builders/InvoicePayerBuilder';
import {InvoicePaymentMethodBuilder} from '../builders/InvoicePaymentMethodBuilder';
import {InvoiceGroupDO} from '../../../../../core/data-layer/invoices/data-objects/InvoiceGroupDO';
import {InvoiceDO, InvoicePaymentStatus} from '../../../../../core/data-layer/invoices/data-objects/InvoiceDO';
import {CustomerDO, CustomerType} from '../../../../../core/data-layer/customers/data-objects/CustomerDO';
import {InvoicePayerDO} from '../../../../../core/data-layer/invoices/data-objects/payers/InvoicePayerDO';
import {InvoiceItemDO, InvoiceItemType} from '../../../../../core/data-layer/invoices/data-objects/items/InvoiceItemDO';
import {AddOnProductDO} from '../../../../../core/data-layer/add-on-products/data-objects/AddOnProductDO';
import {InvoicePaymentMethodType} from '../../../../../../api/core/data-layer/invoices/data-objects/payers/InvoicePaymentMethodDO';
import {InvoiceTestUtils} from '../utils/InvoiceTestUtils';

export class CustomerInvoicesTestHelper {

    private _testUtils: TestUtils;
    private _thUtils: ThUtils;
    private _invoiceTestUtils: InvoiceTestUtils;

    constructor(private _defaultDataBuilder: DefaultDataBuilder) {
        this._testUtils = new TestUtils();
        this._thUtils = new ThUtils();
        this._invoiceTestUtils = new InvoiceTestUtils();
    }

    public buildSaveInvoiceGroupDOForAddingNewCustomerInvoiceGroup(): SaveInvoiceGroupDO {
        return new SaveInvoiceGroupBuilder()
            .withInvoiceList(this.buildInvoiceListForAddingNewCustomerInvoiceGroup())
            .build();
    }
    private buildInvoiceListForAddingNewCustomerInvoiceGroup(): InvoiceDO[] {
        return [
            new InvoiceBuilder()
                .withItemList(this._invoiceTestUtils.buildRandomItemListOfAddOnProducts(this._defaultDataBuilder.addOnProductList, 2))
                .withPayerList(this.buildOnePayerList())
                .withPaymentStatus(InvoicePaymentStatus.Unpaid)
                .build()
        ];
    }
    
    private buildOnePayerList(): InvoicePayerDO[] {
        var paymentMethod = this._testUtils.getRandomListElement(this._defaultDataBuilder.paymentMethodList);
        return [
            new InvoicePayerBuilder()
                .withCustomerId(this.getIndividualCustomer().id)
                .withPaymentMethod(
                    new InvoicePaymentMethodBuilder()
                        .withType(InvoicePaymentMethodType.DefaultPaymentMethod)
                        .withValue(paymentMethod.id)
                        .build()    
                )
                .withPriceToPay(20)
                .build()
        ];
    }
    private getIndividualCustomer(): CustomerDO {
        var individual;
        _.forEach(this._defaultDataBuilder.customerList, (customer: CustomerDO) => {
            if(!individual && customer.type === CustomerType.Individual) {
                individual = customer;
            }    
        });    
        return individual;
    }

    public buildSaveInvoiceGroupDOForUpdatingCustomerInvoiceGroup(invoiceGroupToUpdate: InvoiceGroupDO): SaveInvoiceGroupDO {
        invoiceGroupToUpdate.invoiceList.push(new InvoiceBuilder()
                .withItemList(this._invoiceTestUtils.buildRandomItemListOfAddOnProducts(this._defaultDataBuilder.addOnProductList, 1))
                .withPayerList(invoiceGroupToUpdate.invoiceList[0].payerList)
                .withPaymentStatus(InvoicePaymentStatus.Unpaid)
                .build());
        return new SaveInvoiceGroupBuilder()
            .withId(invoiceGroupToUpdate.id)
            .withInvoiceList(invoiceGroupToUpdate.invoiceList)   
            .build();
    }

}