import { DefaultDataBuilder } from '../../../../db-initializers/DefaultDataBuilder';
import { InvoiceTestUtils } from '../utils/InvoiceTestUtils';
import { SaveInvoiceGroupBuilder } from '../builders/SaveInvoiceGroupBuilder';
import { SaveInvoiceGroupDO } from '../../../../../core/domain-layer/invoices/save-invoice-group/SaveInvoiceGroupDO';
import { InvoiceBuilder } from '../builders/InvoiceBuilder';
import { InvoicePayerBuilder } from '../builders/InvoicePayerBuilder';
import { InvoiceGroupDO } from '../../../../../core/data-layer/invoices/data-objects/InvoiceGroupDO';
import { InvoicePaymentStatus, InvoiceAccountingType } from '../../../../../core/data-layer/invoices/data-objects/InvoiceDO';
import { InvoiceItemDO } from '../../../../../core/data-layer/invoices/data-objects/items/InvoiceItemDO';
import { IInvoiceItemMeta } from '../../../../../core/data-layer/invoices/data-objects/items/IInvoiceItemMeta';
import { BookingDO } from '../../../../../core/data-layer/bookings/data-objects/BookingDO';
import { GenerateBookingInvoiceDO } from '../../../../../../api/core/domain-layer/invoices/generate-booking-invoice/GenerateBookingInvoiceDO';
import { TransactionFeeDO } from "../../../../../core/data-layer/common/data-objects/payment-method/TransactionFeeDO";

import _ = require("underscore");

export class BookingInvoicesTestHelper {

    private _invoiceTestUtils: InvoiceTestUtils;

    constructor(private _defaultDataBuilder: DefaultDataBuilder) {
        this._invoiceTestUtils = new InvoiceTestUtils();
    }

    public getFirstBooking(): BookingDO {
        return this._defaultDataBuilder.bookingList[0];
    }

    public buildGenerateBookingInvoiceDOForNewInvoiceGroup(): GenerateBookingInvoiceDO {
        var booking = this.getFirstBooking();

        return {
            groupBookingId: booking.groupBookingId,
            id: booking.id
        };
    }

    public getSecondBooking(): BookingDO {
        return this._defaultDataBuilder.bookingList[1];
    }

    public buildGenerateBookingInvoiceDOForExistingInvoiceGroup(): GenerateBookingInvoiceDO {
        var booking = this.getSecondBooking();

        return {
            groupBookingId: booking.groupBookingId,
            id: booking.id
        };
    }

    public getExpectedNoInvoiceItems(booking: BookingDO): number {
        var noItems = 1 + booking.priceProductSnapshot.includedItems.attachedAddOnProductItemList.length;
        if (booking.price.hasDeductedCommission()) {
            noItems++;
        }
        noItems += booking.reservedAddOnProductIdList.length;
        return noItems;
    }

    public buildSaveInvoiceGroupDOForUpdatingBookingInvoiceGroup(invoiceGroupToUpdate: InvoiceGroupDO): Promise<SaveInvoiceGroupDO> {
        return new Promise<SaveInvoiceGroupDO>((resolve: { (result: SaveInvoiceGroupDO): void }, reject: { (err: any): void }) => {
            try {
                this.buildSaveInvoiceGroupDOForUpdatingBookingInvoiceGroupCore(invoiceGroupToUpdate, resolve, reject);
            } catch (error) {
                reject(error);
            }
        });
    }

    public buildSaveInvoiceGroupDOForUpdatingBookingInvoiceGroupCore(invoiceGroupToUpdate: InvoiceGroupDO,
        resolve: { (result: SaveInvoiceGroupDO): void }, reject: { (err: any): void }) {
        invoiceGroupToUpdate.invoiceList[0].paymentStatus = InvoicePaymentStatus.Paid;

        var aopItemList = this._invoiceTestUtils.buildRandomItemListOfAddOnProducts(this._defaultDataBuilder.addOnProductList, 2);
        var aopItemMetaList = [];
        _.forEach(aopItemList, (aopItem: InvoiceItemDO) => {
            aopItemMetaList.push(aopItem.meta);
        })
        
        this._invoiceTestUtils.getTotalPriceFromItemMetaList(aopItemMetaList).then((totalPrice: number) => {
            var invoicePayer = invoiceGroupToUpdate.invoiceList[0].payerList[0];
            var invoicePayerWithUpdatedPricetoPay = new InvoicePayerBuilder()
                .withCustomerId(invoicePayer.customerId)
                .withPaymentMethod(invoicePayer.paymentMethod)
                .withTransactionFeeSnapshot(TransactionFeeDO.getDefaultTransactionFee())
                .withPriceToPay(totalPrice).build();
            invoiceGroupToUpdate.invoiceList.push(new InvoiceBuilder()
                .withAccountingType(InvoiceAccountingType.Debit)
                .withItemList(aopItemList)
                .withPayerList([invoicePayerWithUpdatedPricetoPay])
                .withPaymentStatus(InvoicePaymentStatus.Unpaid)
                .build());
            resolve(
                new SaveInvoiceGroupBuilder()
                    .withId(invoiceGroupToUpdate.id)
                    .withGroupBookingId(invoiceGroupToUpdate.groupBookingId)
                    .withInvoiceList(invoiceGroupToUpdate.invoiceList)
                    .build()
            );
        }).catch((error) => {
            reject(error);
        });
        
    }

    private getOneBookingIdFromInvoiceGroup(invoiceGroup: InvoiceGroupDO): string {
        return invoiceGroup.invoiceList[0].bookingId;
    }
}