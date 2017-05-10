import {IValidationStructure} from '../../../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../../../utils/th-validation/structure/PrimitiveValidationStructure';
import {ArrayValidationStructure} from '../../../../utils/th-validation/structure/ArrayValidationStructure';
import {StringValidationRule} from '../../../../utils/th-validation/rules/StringValidationRule';

export class BookingChangeCustomersDO {
    groupBookingId: string;
    id: string;
    customerIdList: string[];

    public static getValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "groupBookingId",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            },
            {
                key: "id",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            },
            {
                key: "customerIdList",
                validationStruct: new ArrayValidationStructure(new PrimitiveValidationStructure(new StringValidationRule()))
            }
        ]);
    }
}