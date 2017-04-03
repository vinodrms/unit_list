
import { IValidationStructure } from "../../utils/th-validation/structure/core/IValidationStructure";
import { ObjectValidationStructure } from "../../utils/th-validation/structure/ObjectValidationStructure";
import { PrimitiveValidationStructure } from "../../utils/th-validation/structure/PrimitiveValidationStructure";
import { NumberValidationRule } from "../../utils/th-validation/rules/NumberValidationRule";

export class CommonValidationStructures {
    
    public static getThDateIntervalDOValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "start",
                validationStruct: CommonValidationStructures.getThDateDOValidationStructure()
            },
            {
                key: "end",
                validationStruct: CommonValidationStructures.getThDateDOValidationStructure()
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
}