import {ThUtils} from '../../../../../core/utils/ThUtils';
import {DefaultDataBuilder} from '../../../../db-initializers/DefaultDataBuilder';
import {TestUtils} from '../../../../helpers/TestUtils';

import {GenerateBookingInvoiceDO} from '../../../../../../api/core/domain-layer/invoices/bookings/GenerateBookingInvoiceDO';

export class InvoicesTestHelper {
    private _testUtils: TestUtils;
    private _thUtils: ThUtils;

    constructor(private _defaultDataBuilder: DefaultDataBuilder) {
        this._testUtils = new TestUtils();
        this._thUtils = new ThUtils();
    }

    public getGenerateBookingInvoiceDOForNewInvoiceGroup(): GenerateBookingInvoiceDO {
        var bookingList = this._defaultDataBuilder.bookingList;
        var booking = bookingList[0];

        return {
            groupBookingId: booking.groupBookingId,
            bookingId: booking.bookingId
        };
    }

    public getGenerateBookingInvoiceDOForExistingInvoiceGroup(): GenerateBookingInvoiceDO {
        var bookingList = this._defaultDataBuilder.bookingList;
        var booking = bookingList[1];

        return {
            groupBookingId: booking.groupBookingId,
            bookingId: booking.bookingId
        };
    }
}