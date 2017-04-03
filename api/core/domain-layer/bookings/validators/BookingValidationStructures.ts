import { IValidationStructure } from '../../../utils/th-validation/structure/core/IValidationStructure';
import { ObjectValidationStructure } from '../../../utils/th-validation/structure/ObjectValidationStructure';
import { PrimitiveValidationStructure } from '../../../utils/th-validation/structure/PrimitiveValidationStructure';
import { NumberValidationRule } from '../../../utils/th-validation/rules/NumberValidationRule';
import { CommonValidationStructures } from "../../common/CommonValidations";

export class BookingValidationStructures {

    public static getThTimestampDOValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "thDateDO",
                validationStruct: CommonValidationStructures.getThDateDOValidationStructure()
            },
            {
                key: "thHourDO",
                validationStruct: BookingValidationStructures.getThHourDOValidationStructure()
            }
        ]);
    }
    public static getThHourDOValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "hour",
                validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildIntegerNumberRule(0))
            },
            {
                key: "minute",
                validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildIntegerNumberRule(0))
            }
        ]);
    }

    public static getConfigCapacityDOValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "noAdults",
                validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildIntegerNumberRule(0))
            },
            {
                key: "noChildren",
                validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildIntegerNumberRule(0))
            },
            {
                key: "noBabies",
                validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildIntegerNumberRule(0))
            },
            {
                key: "noBabyBeds",
                validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildIntegerNumberRule(0))
            }
        ])
    }
}