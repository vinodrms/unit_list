import {TestUtils} from '../../../../helpers/TestUtils';
import {InvoiceItemBuilder} from '../builders/InvoiceItemBuilder';
import {InvoiceGroupDO} from '../../../../../core/data-layer/invoices/data-objects/InvoiceGroupDO';
import {InvoiceDO} from '../../../../../core/data-layer/invoices/data-objects/InvoiceDO';
import {SaveInvoiceGroupDO} from '../../../../../core/domain-layer/invoices/save-invoice-group/SaveInvoiceGroupDO';
import {InvoiceItemDO, InvoiceItemType} from '../../../../../core/data-layer/invoices/data-objects/items/InvoiceItemDO';
import {AddOnProductDO} from '../../../../../core/data-layer/add-on-products/data-objects/AddOnProductDO';
import {ThUtils} from '../../../../../core/utils/ThUtils';
import {IInvoiceItemMeta} from '../../../../../core/data-layer/invoices/data-objects/items/IInvoiceItemMeta';
import {InvoicePayerDO} from '../../../../../core/data-layer/invoices/data-objects/payers/InvoicePayerDO';
import {AddOnProductInvoiceItemMetaDO} from '../../../../../core/data-layer/invoices/data-objects/items/add-on-products/AddOnProductInvoiceItemMetaDO';

import should = require('should');

export class InvoiceTestUtils {
    private _testUtils: TestUtils;
    private _thUtils: ThUtils;

    constructor() {
        this._testUtils = new TestUtils();
        this._thUtils = new ThUtils();
    }

    public buildRandomItemListOfAddOnProducts(aopList: AddOnProductDO[], numberOfItems: number): InvoiceItemDO[] {
        var addOnProductIdList = this._testUtils.getIdSampleFrom(aopList, numberOfItems);
        var itemList = [];

        _.forEach(addOnProductIdList, (aopId: string) => {
            var aop = _.find(aopList, (aop: AddOnProductDO) => {
                return aop.id === aopId;
            });
            
            var aopItem = new AddOnProductInvoiceItemMetaDO();
            aopItem.pricePerItem = aop.price;
            aopItem.numberOfItems = 3;
            aopItem.aopDisplayName = aop.name;

            itemList.push(
                new InvoiceItemBuilder()
                    .withId(aop.id)
                    .withType(InvoiceItemType.AddOnProduct)
                    .withMetaObject(aopItem)
                    .build()
            );
        });
        return itemList;
    }

    public getDistinctCustomerIdListFromInvoiceGroupList(invoiceGroupList: InvoiceGroupDO[]): string[] {
        return _.chain(invoiceGroupList).map((invoiceGroup: InvoiceGroupDO) => {
            return invoiceGroup.invoiceList;
        }).flatten().map((invoice: InvoiceDO) => {
            return invoice.payerList;
        }).flatten().map((invoicePayer: InvoicePayerDO) => {
            return invoicePayer.customerId;
        }).uniq().value();
    }

    public getTotalPriceFromItemMetaList(invoiceItemMetaList: IInvoiceItemMeta[]): Promise<number> {
        return new Promise<number>((resolve: { (result: number): void }, reject: { (err: any): void }) => {
            try {
                this.getTotalPriceFromItemMetaListCore(invoiceItemMetaList, resolve, reject);
            } catch (error) {
                reject(error);
            }
        });
    }

    private getTotalPriceFromItemMetaListCore(invoiceItemMetaList: IInvoiceItemMeta[], resolve: { (result: number): void }, reject: { (err: any): void }) {
        var totalPrice = 0;
        var getPricePromiseList = [];
        _.forEach(invoiceItemMetaList, (invoiceItemMeta: IInvoiceItemMeta) => {
            getPricePromiseList.push(invoiceItemMeta.getUnitPrice());
        });
        Promise.all(getPricePromiseList).then((pricePerItemList: number[]) => {
            for (var i = 0; i < pricePerItemList.length; ++i) {
                totalPrice += pricePerItemList[i] * invoiceItemMetaList[i].getNumberOfItems();
            }
            resolve(totalPrice);
        }).catch((error: any) => {
            reject(error);
        });
    }

    public testInvoiceGroupEquality(invoiceGroup: InvoiceGroupDO, saveInvoiceGroupDO: SaveInvoiceGroupDO) {
        if (!this._thUtils.isUndefinedOrNull(saveInvoiceGroupDO.id)) {
            should.equal(invoiceGroup.id, saveInvoiceGroupDO.id);
        }
        if (!this._thUtils.isUndefinedOrNull(saveInvoiceGroupDO.groupBookingId)) {
            should.equal(invoiceGroup.groupBookingId, saveInvoiceGroupDO.groupBookingId);
        }
        should.equal(invoiceGroup.invoiceList.length, saveInvoiceGroupDO.invoiceList.length);
        for (var i = 0; i < invoiceGroup.invoiceList.length; ++i) {
            this.testInvoiceEquality(invoiceGroup.invoiceList[i], saveInvoiceGroupDO.invoiceList[i]);
        }
    }

    public testInvoiceEquality(invoice1: InvoiceDO, invoice2: InvoiceDO) {
        if (!this._thUtils.isUndefinedOrNull(invoice2.bookingId)) {
            should.equal(invoice1.bookingId, invoice2.bookingId);
        }
        should.equal(invoice1.itemList.length, invoice2.itemList.length);
        for (var i = 0; i < invoice1.itemList.length; ++i) {
            should.equal(invoice1.itemList[i].id, invoice2.itemList[i].id);
            should.equal(invoice1.itemList[i].type, invoice2.itemList[i].type);
        }
        should.equal(invoice1.payerList.length, invoice2.payerList.length);
        for (var i = 0; i < invoice1.payerList.length; ++i) {
            should.equal(invoice1.payerList[i].customerId, invoice2.payerList[i].customerId);
            should.equal(invoice1.payerList[i].priceToPay, invoice2.payerList[i].priceToPay);
            should.equal(invoice1.payerList[i].paymentMethod.type, invoice2.payerList[i].paymentMethod.type);
            should.equal(invoice1.payerList[i].paymentMethod.value, invoice2.payerList[i].paymentMethod.value);
        }
        should.equal(invoice1.paymentStatus, invoice2.paymentStatus);
    }
}