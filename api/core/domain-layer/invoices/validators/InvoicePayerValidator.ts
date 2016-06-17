import {InvoiceDO} from '../../../data-layer/invoices/data-objects/InvoiceDO';
import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {CustomerDO} from '../../../data-layer/customers/data-objects/CustomerDO';
import {PayerDO} from '../../../data-layer/invoices/data-objects/payers/PayerDO';

export class InvoicePayersValidator {
    private _invoice: InvoiceDO;

    constructor(private _customersContainer) {

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
        if (this.getTheNumberOfPayersThatCanPayInvoiceByAgreement() <= 1) {
            resolve(this._invoice);
        }
        else {
            var thError = new ThError(ThStatusCode.InvoicePayersValidatorInvalidSplit, null);
            reject(thError);
        }
    }

    private getTheNumberOfPayersThatCanPayInvoiceByAgreement(): number {
        return _.chain(this._invoice.payerList).map((payer: PayerDO) => {
            return payer.customerId;
        }).map((customerId: string) => {
            return this._customersContainer.getCustomerById(customerId);
        }).reduce((count, customer: CustomerDO) => {
            return count + customer.customerDetails.canPayInvoiceByAgreement();
        }, 0).value();
    }
}