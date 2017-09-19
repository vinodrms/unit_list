import _ = require('underscore');
import { AppContext } from "../../../utils/AppContext";
import { SessionContext } from "../../../utils/SessionContext";
import { InvoiceDO, InvoicePaymentStatus } from "../../../data-layer/invoices/data-objects/InvoiceDO";
import { ThError } from "../../../utils/th-responses/ThError";
import { ThStatusCode } from "../../../utils/th-responses/ThResponse";
import { ThLogger, ThLogLevel } from "../../../utils/logging/ThLogger";

export class ReinstateInvoice {
    private invoice: InvoiceDO;

    constructor(private appContext: AppContext, private sessionContext: SessionContext) {
    }

    /**
     * Returns the credit and the reinstated invoices
     * @param invoiceId The id of the invoice that will be reinstated
     */
    public reinstate(invoiceId: string): Promise<InvoiceDO[]> {
        return new Promise<InvoiceDO[]>((resolve: { (result: InvoiceDO[]): void }, reject: { (err: ThError): void }) => {
            this.reinstateCore(resolve, reject, invoiceId);
        });
    }

    private reinstateCore(resolve: { (result: InvoiceDO[]): void }, reject: { (err: ThError): void }, invoiceId: string) {
        let invoiceRepo = this.appContext.getRepositoryFactory().getInvoiceRepository();
        invoiceRepo.getInvoiceById({ hotelId: this.sessionContext.sessionDO.hotel.id }, invoiceId)
            .then((invoice: InvoiceDO) => {
                if (!invoice.isPaid()) {
                    var thError = new ThError(ThStatusCode.ReinstateInvoiceInvoiceNotPaid, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "tried to reinstante an invoice not Paid", { invoiceId: invoiceId }, thError);
                    throw thError;
                }
                this.invoice = invoice;

                return this.getExistingCreditFor(invoice);
            }).then((existingCredit: InvoiceDO) => {
                if (!this.appContext.thUtils.isUndefinedOrNull(existingCredit)) {
                    var thError = new ThError(ThStatusCode.ReinstateInvoiceCreditExists, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "credit already exists for this invoice", { invoiceId: invoiceId }, thError);
                    throw thError;
                }

                let timestamp = (new Date()).getTime();
                let credit = this.getCreditInvoiceFor(this.invoice, timestamp);
                let reinstatement = this.getReinstatedInvoiceFor(this.invoice, timestamp);
                return this.addInvoices([credit, reinstatement]);
            }).then((invoices: InvoiceDO[]) => {
                resolve(invoices);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.ReinstateInvoiceError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error reinstating invoice", { invoiceId: invoiceId }, thError);
                reject(thError);
            });
    }

    private getExistingCreditFor(invoice: InvoiceDO): Promise<InvoiceDO> {
        return new Promise<InvoiceDO>((resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) => {
            let invoiceRepo = this.appContext.getRepositoryFactory().getInvoiceRepository();
            invoiceRepo.getInvoiceList({ hotelId: this.sessionContext.sessionDO.hotel.id }, {
                invoicePaymentStatus: InvoicePaymentStatus.Credit,
                reference: invoice.reference
            }).then(result => {
                if (result.invoiceList.length > 1) {
                    var thError = new ThError(ThStatusCode.ReinstateInvoiceMoreCreditsFoundForTheSameReference, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Error, "more than 1 credit invoice found for the same reference", { invoiceId: invoice.id }, thError);
                    reject(thError);
                }
                else if (result.invoiceList.length == 1) {
                    resolve(result.invoiceList[0]);
                }
                else if (result.invoiceList.length == 0) {
                    resolve(null);
                }
            }).catch(err => { reject(err); })
        });
    }

    private getCreditInvoiceFor(invoice: InvoiceDO, timestamp: number): InvoiceDO {
        let credit = new InvoiceDO();
        credit.buildFromObject(invoice);
        credit.paymentStatus = InvoicePaymentStatus.Credit;
        delete credit.reinstatedInvoiceId;
        credit = this.prepare(credit, timestamp);
        return credit;
    }

    private getReinstatedInvoiceFor(invoice: InvoiceDO, timestamp: number): InvoiceDO {
        let reinstated = new InvoiceDO();
        reinstated.buildFromObject(invoice);
        delete reinstated.reference;
        reinstated.paymentStatus = InvoicePaymentStatus.Unpaid;
        reinstated.reinstatedInvoiceId = invoice.id;
        reinstated = this.prepare(reinstated, timestamp);
        return reinstated;
    }

    private prepare(invoice: InvoiceDO, timestamp: number): InvoiceDO {
        delete invoice.id;
        delete invoice.paidTimestamp;
        delete invoice.paymentDueDate;
        invoice.itemList.forEach(item => {
            item.transactionId = this.appContext.thUtils.generateUniqueID();
            item.timestamp = timestamp;
        });
        invoice.payerList.forEach(payer => {
            payer.paymentList.forEach(payment => {
                payment.transactionId = this.appContext.thUtils.generateUniqueID();
                payment.timestamp = timestamp;
            });
        });
        return invoice;
    }

    private addInvoices(invoices: InvoiceDO[]): Promise<InvoiceDO[]> {
        let promises: Promise<InvoiceDO>[] = [];
        invoices.forEach((invoice: InvoiceDO) => {
            let repo = this.appContext.getRepositoryFactory().getInvoiceRepository();
            promises.push(repo.addInvoice({ hotelId: this.sessionContext.sessionDO.hotel.id }, invoice));
        });
        return Promise.all(promises);
    }
}
