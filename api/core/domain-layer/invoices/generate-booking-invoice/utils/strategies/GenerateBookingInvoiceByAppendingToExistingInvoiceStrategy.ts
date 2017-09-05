import _ = require('underscore');
import { AGenerateBookingInvoiceActionStrategy } from "../AGenerateBookingInvoiceActionStrategy";
import { ThError } from "../../../../../utils/th-responses/ThError";
import { InvoiceDO } from "../../../../../data-layer/invoices/data-objects/InvoiceDO";
import { BookingDO } from "../../../../../data-layer/bookings/data-objects/BookingDO";
import { BookingInvoiceItem } from "../../GenerateBookingInvoiceDO";
import { AppContext } from "../../../../../utils/AppContext";
import { SessionContext } from "../../../../../utils/SessionContext";

export interface GenerateBookingInvoiceByAppendingToExistingInvoiceStrategyParams {
    booking: BookingDO;
    initialInvoiceItemList: BookingInvoiceItem[];
    invoice: InvoiceDO;
}

export class GenerateBookingInvoiceByAppendingToExistingInvoiceStrategy extends AGenerateBookingInvoiceActionStrategy {

    constructor(appContext: AppContext, sessionContext: SessionContext,
        private params: GenerateBookingInvoiceByAppendingToExistingInvoiceStrategyParams) {
        super(appContext, sessionContext, params.booking, params.initialInvoiceItemList);
    }

    generateBookingInvoice(resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) {
        let invoiceToUpdate = this.params.invoice;
        let newItemList = this.getInvoiceItemList();
        invoiceToUpdate.itemList = invoiceToUpdate.itemList.concat(newItemList);
        this.appendBookingNotesTo(invoiceToUpdate);

        let invoiceRepo = this.appContext.getRepositoryFactory().getInvoiceRepository();
        invoiceRepo.updateInvoice({ hotelId: this.sessionContext.sessionDO.hotel.id }, {
            id: invoiceToUpdate.id,
            versionId: invoiceToUpdate.versionId
        }, invoiceToUpdate).then((updatedInvoice: InvoiceDO) => {
            updatedInvoice.recomputePrices();
            let invoiceRepo = this.appContext.getRepositoryFactory().getInvoiceRepository();
            return invoiceRepo.updateInvoice({ hotelId: this.sessionContext.sessionDO.hotel.id }, {
                id: updatedInvoice.id,
                versionId: updatedInvoice.versionId
            }, updatedInvoice);
        }).then((finalInvoice: InvoiceDO) => {
            resolve(finalInvoice);
        }).catch(e => {
            reject(e);
        });
    }
    private appendBookingNotesTo(invoice: InvoiceDO) {
        if (_.isEmpty(this.booking.invoiceNotes)) {
            return;
        }
        if (_.isEmpty(invoice.notesFromBooking)) {
            invoice.notesFromBooking = this.booking.invoiceNotes;
        }
        else {
            invoice.notesFromBooking += "\n" + this.booking.invoiceNotes;
        }
    }
}
