import { BookingDO } from "../../../../data-layer/bookings/data-objects/BookingDO";
import { AppContext } from "../../../../utils/AppContext";
import { SessionContext } from "../../../../utils/SessionContext";
import { BookingInvoiceItem } from "../GenerateBookingInvoiceDO";
import { IGenerateBookingInvoiceActionStrategy } from "./IGenerateBookingInvoiceActionStrategy";
import { ThError } from "../../../../utils/th-responses/ThError";
import { InvoicePaymentStatus } from "../../../../data-layer/invoices/data-objects/InvoiceDO";
import { InvoiceSearchResultRepoDO } from "../../../../data-layer/invoices/repositories/IInvoiceRepository";
import { GenerateBookingInvoiceByCreatingNewInvoiceStrategy } from "./strategies/GenerateBookingInvoiceByCreatingNewInvoiceStrategy";
import { GenerateBookingInvoiceByAppendingToExistingInvoiceStrategy } from "./strategies/GenerateBookingInvoiceByAppendingToExistingInvoiceStrategy";

export class GenerateBookingInvoiceActionFactory {

    constructor(private appContext: AppContext, private sessionContext: SessionContext) { }

    public getActionStrategy(booking: BookingDO, initialInvoiceItemList: BookingInvoiceItem[]): Promise<IGenerateBookingInvoiceActionStrategy> {
        return new Promise<IGenerateBookingInvoiceActionStrategy>((resolve: { (result: IGenerateBookingInvoiceActionStrategy): void }, reject: { (err: ThError): void }) => {
            this.getActionStrategyCore(resolve, reject, booking, initialInvoiceItemList);
        });
    }

    private getActionStrategyCore(resolve: { (result: IGenerateBookingInvoiceActionStrategy): void }, reject: { (err: ThError): void },
        booking: BookingDO, initialInvoiceItemList: BookingInvoiceItem[]) {

        if (!booking.mergeInvoice) {
            // generate as a new invoice within a new group
            let strategy = new GenerateBookingInvoiceByCreatingNewInvoiceStrategy(this.appContext, this.sessionContext, {
                booking: booking,
                initialInvoiceItemList: initialInvoiceItemList,
                invoiceGroupId: this.appContext.thUtils.generateUniqueID()
            });
            resolve(strategy);
            return;
        }

        let invoiceRepo = this.appContext.getRepositoryFactory().getInvoiceRepository();
        invoiceRepo.getInvoiceList({ hotelId: this.sessionContext.sessionDO.hotel.id }, {
            groupId: booking.groupBookingId,
            invoicePaymentStatus: InvoicePaymentStatus.Unpaid
        }).then((searchResult: InvoiceSearchResultRepoDO) => {
            if (searchResult.invoiceList.length > 0) {
                let invoice = searchResult.invoiceList[0];
                let strategy = new GenerateBookingInvoiceByAppendingToExistingInvoiceStrategy(this.appContext, this.sessionContext, {
                    booking: booking,
                    initialInvoiceItemList: initialInvoiceItemList,
                    invoice: invoice
                });
                resolve(strategy);
            }
            else {
                // generate the new invoice within a group with the same invoiceGroupId as the groupBookingId
                let strategy = new GenerateBookingInvoiceByCreatingNewInvoiceStrategy(this.appContext, this.sessionContext, {
                    booking: booking,
                    initialInvoiceItemList: initialInvoiceItemList,
                    invoiceGroupId: booking.groupBookingId
                });
                resolve(strategy);
            }
        }).catch(e => {
            reject(e);
        });
    }
}
