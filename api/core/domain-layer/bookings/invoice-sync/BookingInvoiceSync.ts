import { ThLogger, ThLogLevel } from '../../../utils/logging/ThLogger';
import { ThError } from '../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../utils/th-responses/ThResponse';
import { AppContext } from '../../../utils/AppContext';
import { ThUtils } from '../../../utils/ThUtils';
import { SessionContext } from '../../../utils/SessionContext';
import { BookingDO } from '../../../data-layer/bookings/data-objects/BookingDO';
import { InvoiceGroupDO } from '../../../data-layer/invoices/data-objects/InvoiceGroupDO';
import { InvoiceDO } from '../../../data-layer/invoices/data-objects/InvoiceDO';
import { InvoicePayerDO } from '../../../data-layer/invoices/data-objects/payers/InvoicePayerDO';
import { InvoiceGroupSearchResultRepoDO } from '../../../data-layer/invoices/repositories/IInvoiceGroupsRepository';

import _ = require('underscore');

enum BookingInvoiceSyncType {
    Pricing,
    Notes,
};

export class BookingInvoiceSync {
    private _thUtils: ThUtils;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
    }

    public syncInvoiceWithBookingPrice(booking: BookingDO): Promise<InvoiceGroupDO> {
        return new Promise<InvoiceGroupDO>((resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) => {
            this.syncInvoiceWithBookingCore(resolve, reject, booking, BookingInvoiceSyncType.Pricing);
        });
    }

    public syncInvoiceWithBookingNotes(booking: BookingDO): Promise<InvoiceGroupDO> {
        return new Promise<InvoiceGroupDO>((resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) => {
            this.syncInvoiceWithBookingCore(resolve, reject, booking, BookingInvoiceSyncType.Notes);
        });
    }

    private syncInvoiceWithBookingCore(resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }, booking: BookingDO, syncType: BookingInvoiceSyncType) {
        let invoiceRepository = this._appContext.getRepositoryFactory().getInvoiceGroupsRepository();
        invoiceRepository.getInvoiceGroupList({
            hotelId: this._sessionContext.sessionDO.hotel.id
        }, {
                groupBookingId: booking.groupBookingId,
                bookingId: booking.bookingId
            }
        ).then((searchResult: InvoiceGroupSearchResultRepoDO) => {
            if (searchResult.invoiceGroupList.length == 0) {
                return new Promise<InvoiceGroupDO>((resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) => {
                    resolve(null);
                });
            }
            let invoiceGroup = searchResult.invoiceGroupList[0];
            let syncIsRequired = false;
            switch (syncType) {
                case BookingInvoiceSyncType.Pricing: syncIsRequired = this.syncInvoiceWithBookingPriceForGroup(invoiceGroup, booking); break;
                case BookingInvoiceSyncType.Notes: syncIsRequired = this.syncInvoiceWithBookingNotesForGroup(invoiceGroup, booking); break;
                default: syncIsRequired = false;
            }

            if (!syncIsRequired) {
                return new Promise<InvoiceGroupDO>((resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) => {
                    resolve(invoiceGroup);
                });
            }
            return invoiceRepository.updateInvoiceGroup({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                id: invoiceGroup.id,
                versionId: invoiceGroup.versionId
            }, invoiceGroup);
        }).then((updatedInvoiceGroup: InvoiceGroupDO) => {
            resolve(updatedInvoiceGroup);
        }).catch((e) => {
            reject(e);
        });
    }

    private syncInvoiceWithBookingPriceForGroup(invoiceGroup: InvoiceGroupDO, booking: BookingDO): boolean {
        let invoice = this.getBookingInvoiceFromInvoiceGroup(invoiceGroup, booking);

        if (invoice.isClosed()) {
            return false;
        }
        let priceToPay = invoice.getPrice();
        let payersPriceToPay = this.getInvoicePayersPriceToPay(invoice);

        if (priceToPay == payersPriceToPay) {
            return false;
        }

        let priceForEachPayer = (priceToPay - payersPriceToPay) / invoice.payerList.length;
        invoice.payerList.forEach((payer: InvoicePayerDO) => {
            payer.priceToPay += priceForEachPayer;
            payer.priceToPay = this._thUtils.roundNumberToTwoDecimals(payer.priceToPay);
        });

        return true;
    }

    private getInvoicePayersPriceToPay(invoice: InvoiceDO): number {
        var payerTotalPrice = 0.0;
        invoice.payerList.forEach((payer: InvoicePayerDO) => {
            payerTotalPrice += payer.priceToPay;
        });
        return payerTotalPrice;
    }

    private syncInvoiceWithBookingNotesForGroup(invoiceGroup: InvoiceGroupDO, booking: BookingDO): boolean {
        let invoice = this.getBookingInvoiceFromInvoiceGroup(invoiceGroup, booking);
        if (invoice.notesFromBooking == booking.invoiceNotes) {
            return false;
        }
        if (invoice.isClosed()) {
            return false;
        }
        invoice.notesFromBooking = booking.invoiceNotes;
        return true;
    }

    private getBookingInvoiceFromInvoiceGroup(invoiceGroup: InvoiceGroupDO, booking: BookingDO): InvoiceDO {
        let invoice = _.find(invoiceGroup.invoiceList, (invoice: InvoiceDO) => { return invoice.bookingId == booking.bookingId });
        if (this._thUtils.isUndefinedOrNull(invoice)) {
            var thError = new ThError(ThStatusCode.BookingInvoiceUtilsInvoiceNotFound, null);
            ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invoice not found for booking in group", {
                groupBookingId: booking.groupBookingId,
                bookingId: booking.bookingId,
                invoiceGroupId: invoiceGroup.id
            }, thError);
            throw thError;
        }
        return invoice;
    }

}