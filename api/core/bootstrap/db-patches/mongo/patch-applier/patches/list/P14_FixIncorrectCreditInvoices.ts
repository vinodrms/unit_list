import _ = require('underscore');
import { APaginatedTransactionalMongoPatch } from "../../utils/APaginatedTransactionalMongoPatch";
import { MongoRepository } from "../../../../../../data-layer/common/base/MongoRepository";
import { MongoPatchType } from "../MongoPatchType";
import { ThError } from "../../../../../../utils/th-responses/ThError";
import { InvoiceDO, InvoiceAccountingType } from '../../../../../../data-layer/invoices/data-objects/InvoiceDO';
import { InvoicePaymentStatus } from '../../../../../../data-layer/invoices-legacy/data-objects/InvoiceDO';
import { InvoicePayerDO } from '../../../../../../data-layer/invoices/data-objects/payer/InvoicePayerDO';

export class P14_FixIncorrectCreditInvoices extends APaginatedTransactionalMongoPatch {

    protected getMongoRepository(): MongoRepository {
        return this.invoiceRepository;
    }

    public getPatchType(): MongoPatchType {
        return MongoPatchType.FixIncorrectCreditInvoices;
    }

    protected updateDocumentInMemoryAsyncCore(resolve: { (result: any): void }, reject: { (err: ThError): void }, creditInvoice: InvoiceDO) {
        if (creditInvoice.accountingType != InvoiceAccountingType.Credit
            || creditInvoice.paymentStatus != InvoicePaymentStatus.Paid) {
            resolve(creditInvoice);
            return;
        }
        this.invoiceRepository.getInvoiceList({ hotelId: creditInvoice.hotelId }, {
            reference: creditInvoice.reference,
            invoiceAccountingType: InvoiceAccountingType.Debit
        }).then(searchResult => {
            if (searchResult.invoiceList.length != 1) {
                resolve(creditInvoice);
                return;
            }
            let originalInvoice = searchResult.invoiceList[0];

            creditInvoice.amountPaid = originalInvoice.amountPaid;
            creditInvoice.amountToPay = originalInvoice.amountToPay;

            creditInvoice.payerList = [];
            originalInvoice.payerList.forEach(originalPayer => {
                let creditPayer = new InvoicePayerDO();
                creditPayer.buildFromObject(originalPayer);
                creditPayer.paymentList.forEach(payment => {
                    payment.transactionId = this.thUtils.generateUniqueID();
                    payment.timestamp = creditInvoice.paidTimestamp;
                });
                creditInvoice.payerList.push(creditPayer);
            });

            resolve(creditInvoice);
        }).catch(e => {
            reject(e);
        });
    }

    protected updateDocumentInMemory(booking) { }
}
