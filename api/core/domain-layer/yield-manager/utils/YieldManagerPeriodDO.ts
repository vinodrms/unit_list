import {IValidationStructure} from '../../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../../utils/th-validation/structure/PrimitiveValidationStructure';
import {NumberValidationRule} from '../../../utils/th-validation/rules/NumberValidationRule';
import {BookingValidationStructures} from '../../bookings/validators/BookingValidationStructures';
import {ThDateDO} from '../../../utils/th-dates/data-objects/ThDateDO';

export class YieldManagerPeriodDO {
    referenceDate: ThDateDO;
    noDays: number;

    public static getValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "referenceDate",
                validationStruct: BookingValidationStructures.getThDateDOValidationStructure()
            },
            {
                key: "noDays",
                validationStruct: new PrimitiveValidationStructure(YieldManagerPeriodDO.getNoDaysValidationRule())
            }
        ]);
    }
    private static getNoDaysValidationRule(): NumberValidationRule {
        var numberRule = new NumberValidationRule();
        numberRule.minValue = 1;
        numberRule.isInteger = true;
        return numberRule;
    }
}