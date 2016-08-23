import {AppContext} from '../../../../../../utils/AppContext';
import {SessionContext} from '../../../../../../utils/SessionContext';

import {IValidationStructure} from '../../../../../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../../../../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../../../../../utils/th-validation/structure/PrimitiveValidationStructure';
import {StringValidationRule} from '../../../../../../utils/th-validation/rules/StringValidationRule';

import {IEmailConfirmationStrategy} from '../IEmailConfirmationStrategy';
import {EmailConfirmationDO} from '../../EmailConfirmationDO';

export interface InvoiceEmailConfirmationParams {
    invoiceGroupId: string;
    invoiceReference: string;
    customerId: string;
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
                key: "invoiceReference",
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

        // TODO: send email and remove mock promise
        return new Promise<boolean>((resolve: { (result: boolean): void }, reject: { (err: any): void }) => {
            resolve(true);
        });
    }
}