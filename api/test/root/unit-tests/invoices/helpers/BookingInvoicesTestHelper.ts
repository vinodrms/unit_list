import {DefaultDataBuilder} from '../../../../db-initializers/DefaultDataBuilder';
import {TestUtils} from '../../../../helpers/TestUtils';
import {InvoiceTestUtils} from '../utils/InvoiceTestUtils';

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
import {GenerateBookingInvoiceDO} from '../../../../../../api/core/domain-layer/invoices/generate-booking-invoice/GenerateBookingInvoiceDO';

export class BookingInvoicesTestHelper {

    private _invoiceTestUtils: InvoiceTestUtils;

    constructor(private _defaultDataBuilder: DefaultDataBuilder) {        
        this._invoiceTestUtils = new InvoiceTestUtils();
    }

    public buildGenerateBookingInvoiceDOForNewInvoiceGroup(): GenerateBookingInvoiceDO {
        var bookingList = this._defaultDataBuilder.bookingList;
        var booking = bookingList[0];

        return {
            groupBookingId: booking.groupBookingId,
            bookingId: booking.bookingId
        };
    }

    public buildGenerateBookingInvoiceDOForExistingInvoiceGroup(): GenerateBookingInvoiceDO {
        var bookingList = this._defaultDataBuilder.bookingList;
        var booking = bookingList[1];

        return {
            groupBookingId: booking.groupBookingId,
            bookingId: booking.bookingId
        };
    }

    public buildSaveInvoiceGroupDOForUpdatingBookingInvoiceGroup(invoiceGroupToUpdate: InvoiceGroupDO): SaveInvoiceGroupDO {
        invoiceGroupToUpdate.invoiceList.push(new InvoiceBuilder()
                .withBookingId(this.getOneBookingIdFromInvoiceGroup(invoiceGroupToUpdate))
                .withItemList(this._invoiceTestUtils.buildRandomItemListOfAddOnProducts(this._defaultDataBuilder.addOnProductList, 1))
                .withPayerList(invoiceGroupToUpdate.invoiceList[0].payerList)
                .withPaymentStatus(InvoicePaymentStatus.Open)
                .build());
        return new SaveInvoiceGroupBuilder()
            .withId(invoiceGroupToUpdate.id)
            .withGroupBookingId(invoiceGroupToUpdate.groupBookingId)
            .withInvoiceList(invoiceGroupToUpdate.invoiceList)   
            .withPaymentStatus(InvoicePaymentStatus.Open)
            .build();
    }
    private getOneBookingIdFromInvoiceGroup(invoiceGroup: InvoiceGroupDO): string {
        return invoiceGroup.invoiceList[0].bookingId;
    }
}