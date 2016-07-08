import {ThUtils} from '../../../../../core/utils/ThUtils';
import {DefaultDataBuilder} from '../../../../db-initializers/DefaultDataBuilder';
import {TestUtils} from '../../../../helpers/TestUtils';
import {InvoiceGroupDO} from '../../../../../core/data-layer/invoices/data-objects/InvoiceGroupDO';
import {InvoiceDO, InvoicePaymentStatus} from '../../../../../core/data-layer/invoices/data-objects/InvoiceDO';
import {InvoicePayerDO} from '../../../../../core/data-layer/invoices/data-objects/payers/InvoicePayerDO';
import {InvoicePaymentMethodType, InvoicePaymentMethodDO} from '../../../../../core/data-layer/invoices/data-objects/payers/InvoicePaymentMethodDO';
import {InvoiceItemDO, InvoiceItemType} from '../../../../../core/data-layer/invoices/data-objects/items/InvoiceItemDO';
import {CommissionDO} from '../../../../../core/data-layer/common/data-objects/commission/CommissionDO';
import {CustomerType, CustomerDO} from '../../../../../core/data-layer/customers/data-objects/CustomerDO';
import {PaymentMethodDO} from '../../../../../core/data-layer/common/data-objects/payment-method/PaymentMethodDO';
import {CompanyDetailsDO} from '../../../../../core/data-layer/customers/data-objects/customer-details/corporate/CompanyDetailsDO';
import {AddNewBookingInvoiceGroupDO} from '../../../../../core/domain-layer/invoices/add-invoice-groups/AddNewBookingInvoiceGroupDO';
import {UpdateInvoiceGroupDO} from '../../../../../core/domain-layer/invoices/update-invoice-groups/UpdateInvoiceGroupDO';

export class InvoicesTestHelper {
    private _testUtils: TestUtils;
    private _thUtils: ThUtils;

    constructor(private _defaultDataBuilder: DefaultDataBuilder) {
        this._testUtils = new TestUtils();
        this._thUtils = new ThUtils();
    }

    public getAddNewBookingInvoiceGroupDO(): AddNewBookingInvoiceGroupDO {
        var generateBookingInvoiceGroupItemDO = new AddNewBookingInvoiceGroupDO();
		var bookingList = this._defaultDataBuilder.bookingList;
        var booking = bookingList[0];

        return {
        groupBookingId: booking.groupBookingId,
            bookingId: booking.bookingId
        };
	}

    public getUpdateInvoiceGroupDO(existingInvoiceGroup: InvoiceGroupDO): UpdateInvoiceGroupDO {

        var currentInvoiceGroupId = existingInvoiceGroup.id;
        var currentInvoiceList = existingInvoiceGroup.invoiceList;
        var currentPaymentStatus = existingInvoiceGroup.paymentStatus;

        currentInvoiceList.push(this.getNewInvoice());

        return {
            id: currentInvoiceGroupId,
            invoiceList: currentInvoiceList,
            paymentStatus: currentPaymentStatus
        };
	}

    public getNewInvoice(): InvoiceDO {
        var newInvoice = new InvoiceDO();
        newInvoice.payerList = [];
        newInvoice.itemList = [];
        newInvoice.paymentStatus = InvoicePaymentStatus.Open;
        return newInvoice;
    }
}