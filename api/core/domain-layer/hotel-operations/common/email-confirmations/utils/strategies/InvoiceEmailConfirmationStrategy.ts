import _ = require("underscore");
import { AppContext } from '../../../../../../utils/AppContext';
import { SessionContext } from '../../../../../../utils/SessionContext';
import { IValidationStructure } from '../../../../../../utils/th-validation/structure/core/IValidationStructure';
import { ObjectValidationStructure } from '../../../../../../utils/th-validation/structure/ObjectValidationStructure';
import { PrimitiveValidationStructure } from '../../../../../../utils/th-validation/structure/PrimitiveValidationStructure';
import { StringValidationRule } from '../../../../../../utils/th-validation/rules/StringValidationRule';
import { IEmailConfirmationStrategy } from '../IEmailConfirmationStrategy';
import { EmailConfirmationDO } from '../../EmailConfirmationDO';
import { EmailDistributionDO } from "../data-objects/EmailDistributionDO";
import { InvoiceConfirmationEmailSender } from '../../../../../invoices/invoice-confirmations/InvoiceConfirmationEmailSender';
import { InvoiceDataAggregatorQuery } from '../../../../../invoices/aggregators/InvoiceDataAggregator';

export interface InvoiceEmailConfirmationParams {
    invoiceId: string;
    customerId: string;
}
export class InvoiceEmailConfirmationStrategy implements IEmailConfirmationStrategy {
    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
    }

    public getValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "invoiceId",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            },
            {
                key: "customerId",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            }
        ]);
    }
    public send(confirmationDO: EmailConfirmationDO): Promise<boolean> {
        var invoiceConfirmationParams: InvoiceEmailConfirmationParams = confirmationDO.parameters;
        var emailSender: InvoiceConfirmationEmailSender = new InvoiceConfirmationEmailSender(this._appContext, this._sessionContext);
        var invoiceQuery: InvoiceDataAggregatorQuery = {
            customerId: invoiceConfirmationParams.customerId,
            invoiceId: invoiceConfirmationParams.invoiceId,
        };
        var emailList = this.buildEmailList(confirmationDO);
        return emailSender.sendInvoiceConfirmation(invoiceQuery, emailList);
    }

    private buildEmailList(confirmationDO: EmailConfirmationDO): string[] {
        return _.map(confirmationDO.emailList, (emailDistributionDO: EmailDistributionDO) => {
            return emailDistributionDO.email;
        });
    }
}
