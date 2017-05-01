import {AppContext} from '../../../../../../utils/AppContext';
import {SessionContext} from '../../../../../../utils/SessionContext';

import {IValidationStructure} from '../../../../../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../../../../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../../../../../utils/th-validation/structure/PrimitiveValidationStructure';
import {StringValidationRule} from '../../../../../../utils/th-validation/rules/StringValidationRule';

import {IEmailConfirmationStrategy} from '../IEmailConfirmationStrategy';
import {EmailConfirmationDO} from '../../EmailConfirmationDO';
import {InvoiceConfirmationEmailSender} from '../../../../../invoices/invoice-confirmations/InvoiceConfirmationEmailSender';
import {InvoiceDataAggregatorQuery} from '../../../../../invoices/aggregators/InvoiceDataAggregator';

export interface InvoiceEmailConfirmationParams {
    invoiceGroupId: string;
    invoiceId: string;
    customerId: string;
    payerIndex: number;
}
export class InvoiceEmailConfirmationStrategy implements IEmailConfirmationStrategy {
    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
    }

    public getValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "invoiceGroupId",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            },
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
            invoiceGroupId: invoiceConfirmationParams.invoiceGroupId,
            invoiceId: invoiceConfirmationParams.invoiceId,
            payerIndex: invoiceConfirmationParams.payerIndex
        };

        return emailSender.sendInvoiceConfirmation(invoiceQuery, confirmationDO.emailList);
    }
}