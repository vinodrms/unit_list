import { InvoiceDO } from '../../../data-layer/invoices/data-objects/InvoiceDO';
import { ThLogger, ThLogLevel } from '../../../utils/logging/ThLogger';
import { ThError } from '../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../utils/th-responses/ThResponse';
import { CustomerDO } from '../../../data-layer/customers/data-objects/CustomerDO';
import { CustomersContainer } from '../../../domain-layer/customers/validators/results/CustomersContainer';
import { InvoicePayerDO } from '../../../data-layer/invoices/data-objects/payers/InvoicePayerDO';

export class InvoicePayersValidator {
    private _invoice: InvoiceDO;

    constructor(private _customersContainer: CustomersContainer) {

    }

    public validate(invoice: InvoiceDO): Promise<InvoiceDO> {
        this._invoice = invoice;
        return new Promise<InvoiceDO>((resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) => {
            try {
                this.validateCore(resolve, reject);
            } catch (error) {
                var thError = new ThError(ThStatusCode.InvoicePayersValidatorError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error validating payers that split the invoice payment", this._invoice, thError);
                reject(thError);
            }
        });
    }

    private validateCore(resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) {
        if (this.getTheNumberOfPayersThatCanPayInvoiceByAgreement() > 1) {
            var thError = new ThError(ThStatusCode.InvoicePayersValidatorInvalidSplit, null);
            ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Tried to share bill using multiple PIA customers", {
                bookingId: this._invoice.bookingId,
                invoiceid: this._invoice.id
            }, thError);
            reject(thError);
            return;
        }
        if (this._invoice.isWalkInInvoice()) {
            for (var i = 0; i < this._invoice.payerList.length; i++) {
                let payer = this._invoice.payerList[i];
                let customer = this._customersContainer.getCustomerById(payer.customerId);
                if (!customer.canCreateWalkInInvoices()) {
                    var thError = new ThError(ThStatusCode.InvoicePayersValidatorNoAccessToWalkIn, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Tried to use a customer with PIA enabled on a walk in bill", {
                        bookingId: this._invoice.bookingId,
                        invoiceid: this._invoice.id
                    }, thError);
                    reject(thError);
                    return;
                }
            }
        }
        resolve(this._invoice);
    }

    private getTheNumberOfPayersThatCanPayInvoiceByAgreement(): number {
        return _.chain(this._invoice.payerList).map((payer: InvoicePayerDO) => {
            return payer.customerId;
        }).map((customerId: string) => {
            return this._customersContainer.getCustomerById(customerId);
        }).reduce((count, customer: CustomerDO) => {
            return count + (customer.customerDetails.canPayInvoiceByAgreement() ? 1 : 0);
        }, 0).value();
    }
}