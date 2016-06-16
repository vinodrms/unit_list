import {IValidationStructure} from '../../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../../utils/th-validation/structure/PrimitiveValidationStructure';
import {NumberValidationRule} from '../../../utils/th-validation/rules/NumberValidationRule';

export class BookingValidationStructures {
    public static getThDateIntervalDOValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "start",
                validationStruct: BookingValidationStructures.getThDateDOValidationStructure()
            },
            {
                key: "end",
                validationStruct: BookingValidationStructures.getThDateDOValidationStructure()
            }
        ]);
    }
    public static getThDateDOValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "year",
                validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildIntegerNumberRule(0))
            },
            {
                key: "month",
                validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildIntegerNumberRule(0))
            },
            {
                key: "day",
                validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildIntegerNumberRule(1))
            }
        ]);
    }
    public static getConfigCapacityDOValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "noBabies",
                validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildIntegerNumberRule(0))
            },
            {
                key: "noAdults",
                validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildIntegerNumberRule(0))
            },
            {
                key: "noChildren",
                validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildIntegerNumberRule(0))
            }
        ])
    }
}