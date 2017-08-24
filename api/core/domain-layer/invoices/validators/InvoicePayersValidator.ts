import _ = require("underscore");
import { ThLogger, ThLogLevel } from '../../../utils/logging/ThLogger';
import { ThError } from '../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../utils/th-responses/ThResponse';
import { CustomerDO } from '../../../data-layer/customers/data-objects/CustomerDO';
import { CustomersContainer } from '../../../domain-layer/customers/validators/results/CustomersContainer';
import { InvoiceDO } from "../../../data-layer/invoices/data-objects/InvoiceDO";
import { InvoicePayerDO } from "../../../data-layer/invoices/data-objects/payer/InvoicePayerDO";

export class InvoicePayersValidator {
    private invoice: InvoiceDO;

    constructor(private customersContainer: CustomersContainer) { }

    public validate(invoice: InvoiceDO): Promise<InvoiceDO> {
        this.invoice = invoice;
        return new Promise<InvoiceDO>((resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) => {
            try {
                this.validateCore(resolve, reject);
            } catch (error) {
                var thError = new ThError(ThStatusCode.InvoicePayersValidatorError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error validating payers that split the invoice payment", this.invoice, thError);
                reject(thError);
            }
        });
    }

    private validateCore(resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) {
        if (this.getTheNumberOfPayersThatCanPayInvoiceByAgreement() > 1) {
            var thError = new ThError(ThStatusCode.InvoicePayersValidatorInvalidSplit, null);
            ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Tried to share bill using multiple PIA customers", {
                invoiceid: this.invoice.id
            }, thError);
            reject(thError);
            return;
        }
        if (this.invoice.isWalkInInvoice()) {
            for (var i = 0; i < this.invoice.payerList.length; i++) {
                let payer = this.invoice.payerList[i];
                let customer = this.customersContainer.getCustomerById(payer.customerId);
                if (!customer.canCreateWalkInInvoices()) {
                    var thError = new ThError(ThStatusCode.InvoicePayersValidatorNoAccessToWalkIn, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Tried to use a customer with PIA enabled on a walk in bill", {
                        invoiceid: this.invoice.id
                    }, thError);
                    reject(thError);
                    return;
                }
            }
        }
        resolve(this.invoice);
    }

    private getTheNumberOfPayersThatCanPayInvoiceByAgreement(): number {
        return _.chain(this.invoice.payerList).map((payer: InvoicePayerDO) => {
            return payer.customerId;
        }).map((customerId: string) => {
            return this.customersContainer.getCustomerById(customerId);
        }).reduce((count, customer: CustomerDO) => {
            return count + (customer.customerDetails.canPayInvoiceByAgreement() ? 1 : 0);
        }, 0).value();
    }
}
