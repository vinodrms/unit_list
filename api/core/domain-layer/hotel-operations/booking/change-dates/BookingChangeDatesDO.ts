import { IValidationStructure } from '../../../../utils/th-validation/structure/core/IValidationStructure';
import { ObjectValidationStructure } from '../../../../utils/th-validation/structure/ObjectValidationStructure';
import { PrimitiveValidationStructure } from '../../../../utils/th-validation/structure/PrimitiveValidationStructure';
import { StringValidationRule } from '../../../../utils/th-validation/rules/StringValidationRule';
import { BookingValidationStructures } from '../../../bookings/validators/BookingValidationStructures';
import { ThDateIntervalDO } from '../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import { CommonValidationStructures } from "../../../common/CommonValidations";

export class BookingChangeDatesDO {
    groupBookingId: string;
    id: string;
    interval: ThDateIntervalDO;

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
                key: "interval",
                validationStruct: CommonValidationStructures.getThDateIntervalDOValidationStructure()
            }
        ]);
    }
}