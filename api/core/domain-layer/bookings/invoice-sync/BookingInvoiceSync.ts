import _ = require('underscore');
import { ThLogger, ThLogLevel } from '../../../utils/logging/ThLogger';
import { ThError } from '../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../utils/th-responses/ThResponse';
import { AppContext } from '../../../utils/AppContext';
import { ThUtils } from '../../../utils/ThUtils';
import { SessionContext } from '../../../utils/SessionContext';
import { BookingDO } from '../../../data-layer/bookings/data-objects/BookingDO';
import { InvoiceDO, InvoicePaymentStatus } from "../../../data-layer/invoices/data-objects/InvoiceDO";
import { InvoiceSearchResultRepoDO } from "../../../data-layer/invoices/repositories/IInvoiceRepository";

enum BookingInvoiceSyncType {
    Pricing,
    Notes,
};

export class BookingInvoiceSync {
    private _thUtils: ThUtils;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
    }

    public syncInvoiceWithBookingPrice(booking: BookingDO): Promise<InvoiceDO> {
        return new Promise<InvoiceDO>((resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) => {
            this.syncInvoiceWithBookingCore(resolve, reject, booking, BookingInvoiceSyncType.Pricing);
        });
    }

    public syncInvoiceWithBookingNotes(booking: BookingDO): Promise<InvoiceDO> {
        return new Promise<InvoiceDO>((resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) => {
            this.syncInvoiceWithBookingCore(resolve, reject, booking, BookingInvoiceSyncType.Notes);
        });
    }

    private syncInvoiceWithBookingCore(resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }, booking: BookingDO, syncType: BookingInvoiceSyncType) {
        let invoiceRepository = this._appContext.getRepositoryFactory().getInvoiceRepository();
        invoiceRepository.getInvoiceList({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
            bookingId: booking.id,
            invoicePaymentStatus: InvoicePaymentStatus.Unpaid
        }).then((searchResult: InvoiceSearchResultRepoDO) => {
            if (searchResult.invoiceList.length == 0) {
                return new Promise<InvoiceDO>((resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) => {
                    resolve(null);
                });
            }
            let invoice = searchResult.invoiceList[0];
            let syncIsRequired = false;
            switch (syncType) {
                case BookingInvoiceSyncType.Pricing: syncIsRequired = this.syncInvoiceWithBookingPriceForInvoice(invoice, booking); break;
                case BookingInvoiceSyncType.Notes: syncIsRequired = this.syncInvoiceWithBookingNotesForInvoice(invoice, booking); break;
                default: syncIsRequired = false;
            }

            if (!syncIsRequired) {
                return new Promise<InvoiceDO>((resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) => {
                    resolve(invoice);
                });
            }
            return invoiceRepository.updateInvoice({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                id: invoice.id,
                versionId: invoice.versionId
            }, invoice);
        }).then((updatedInvoice: InvoiceDO) => {
            resolve(updatedInvoice);
        }).catch((e) => {
            reject(e);
        });
    }

    private syncInvoiceWithBookingPriceForInvoice(invoice: InvoiceDO, booking: BookingDO): boolean {
        if (invoice.isClosed()) {
            return false;
        }
        invoice.recomputePrices();
        return true;
    }

    private syncInvoiceWithBookingNotesForInvoice(invoice: InvoiceDO, booking: BookingDO): boolean {
        if (invoice.notesFromBooking == booking.invoiceNotes) {
            return false;
        }
        if (invoice.isClosed()) {
            return false;
        }
        invoice.notesFromBooking = booking.invoiceNotes;
        return true;
    }
}
