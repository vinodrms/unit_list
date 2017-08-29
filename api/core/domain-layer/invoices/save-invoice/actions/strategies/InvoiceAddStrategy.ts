import { AppContext } from '../../../../../utils/AppContext';
import { SessionContext } from '../../../../../utils/SessionContext';
import { ThUtils } from '../../../../../utils/ThUtils';
import { ThLogger, ThLogLevel } from '../../../../../utils/logging/ThLogger';
import { ThError } from '../../../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../../../utils/th-responses/ThResponse';
import { TaxResponseRepoDO } from '../../../../../data-layer/taxes/repositories/ITaxRepository';
import { TaxDO } from '../../../../../data-layer/taxes/data-objects/TaxDO';
import { InvoiceDO, InvoicePaymentStatus } from "../../../../../data-layer/invoices/data-objects/InvoiceDO";
import { AInvoiceStrategy } from "./AInvoiceStrategy";

export class InvoiceAddStrategy extends AInvoiceStrategy {

    public saveInvoice(resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) {
        let taxRepo = this.appContext.getRepositoryFactory().getTaxRepository();
        taxRepo.getTaxList({ hotelId: this.hotelId })
            .then((result: TaxResponseRepoDO) => {
                this.invoiceToSave.vatTaxListSnapshot = result.vatList;
                this.invoiceToSave.paymentStatus = InvoicePaymentStatus.Unpaid;
                this.stampInvoice();
                if (this.thUtils.isUndefinedOrNull(this.invoiceToSave.groupId)) {
                    this.invoiceToSave.groupId = this.thUtils.generateUniqueID();
                }
                this.invoiceToSave.recomputePrices();

                var invoiceRepo = this.appContext.getRepositoryFactory().getInvoiceRepository();
                return invoiceRepo.addInvoice({ hotelId: this.hotelId }, this.invoiceToSave);
            }).then((result: InvoiceDO) => {
                resolve(result);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.CustomerInvoiceAddStrategyErrorAdding, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error adding invoice", this.invoiceToSave, thError);
                }
                reject(thError);
            });
    }

    private stampInvoice() {
        this.invoiceToSave.itemList.forEach(item => {
            this.stampItem(item);
        });
        this.invoiceToSave.payerList.forEach(payer => {
            payer.paymentList.forEach(payment => {
                this.stampPayment(payment);
            });
        });
    }

}
