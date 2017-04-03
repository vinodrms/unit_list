import { ThDateIntervalDO } from '../../../utils/th-dates/data-objects/ThDateIntervalDO';
import { IValidationStructure } from '../../../utils/th-validation/structure/core/IValidationStructure';
import { ObjectValidationStructure } from '../../../utils/th-validation/structure/ObjectValidationStructure';
import { PrimitiveValidationStructure } from '../../../utils/th-validation/structure/PrimitiveValidationStructure';
import { StringValidationRule } from '../../../utils/th-validation/rules/StringValidationRule';
import { CommonValidationStructures } from "../../common/CommonValidations";

export class DynamicPriceYieldingDO {
    priceProductId: string;
    dynamicPriceId: string;
    interval: ThDateIntervalDO;

    public static getValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "priceProductId",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            },
            {
                key: "dynamicPriceId",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            },
            {
                key: "interval",
                validationStruct: CommonValidationStructures.getThDateIntervalDOValidationStructure()
            }
        ]);
    }
}