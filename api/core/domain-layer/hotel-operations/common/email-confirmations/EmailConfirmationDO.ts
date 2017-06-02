import {IValidationStructure} from '../../../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../../../utils/th-validation/structure/PrimitiveValidationStructure';
import {ArrayValidationStructure} from '../../../../utils/th-validation/structure/ArrayValidationStructure';
import {NumberInListValidationRule} from '../../../../utils/th-validation/rules/NumberInListValidationRule';
import { EmailValidationRule } from '../../../../utils/th-validation/rules/EmailValidationRule';
import { StringValidationRule } from "../../../../utils/th-validation/rules/StringValidationRule";
import { EmailDistributionDO } from "./utils/data-objects/EmailDistributionDO";

export enum EmailConfirmationType {
    Booking,
    Invoice
}

export class EmailConfirmationDO {
    type: EmailConfirmationType;
    emailList: EmailDistributionDO[];
    parameters: any;

    public static getValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "type",
                validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule([EmailConfirmationType.Booking, EmailConfirmationType.Invoice]))
            },
            {
                key: "emailList",
                validationStruct: new ArrayValidationStructure(
                    new ObjectValidationStructure([
                        {
                            key: "email",
                            validationStruct: new PrimitiveValidationStructure(new EmailValidationRule())
                        },
                        {
                            key: "guestName",
                            validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
                        }
                    ]))
            }
        ]);
    }
}