import {IValidationStructure} from '../../../../../utils/th-validation/structure/core/IValidationStructure';
import {EmailConfirmationDO} from '../EmailConfirmationDO';

export interface IEmailConfirmationStrategy {
    getValidationStructure(): IValidationStructure;
    send(confirmationDO: EmailConfirmationDO): Promise<boolean>;
}