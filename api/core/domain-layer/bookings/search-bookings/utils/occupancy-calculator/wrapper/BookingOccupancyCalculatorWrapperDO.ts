import {ThDateIntervalDO} from '../../../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import {IValidationStructure} from '../../../../../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../../../../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../../../../../utils/th-validation/structure/PrimitiveValidationStructure';
import {StringValidationRule} from '../../../../../../utils/th-validation/rules/StringValidationRule';
import {BookingValidationStructures} from '../../../../validators/BookingValidationStructures';

export class BookingOccupancyCalculatorWrapperDO {
    interval: ThDateIntervalDO;
    bookingIdToOmit: string;

    public static getValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "interval",
                validationStruct: BookingValidationStructures.getThDateIntervalDOValidationStructure()
            },
            {
                key: "bookingIdToOmit",
                validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
            }
        ]);
    }
}