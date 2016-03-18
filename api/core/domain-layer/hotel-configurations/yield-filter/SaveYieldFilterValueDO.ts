import {IValidationStructure} from '../../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../../utils/th-validation/structure/PrimitiveValidationStructure';
import {ArrayValidationStructure} from '../../../utils/th-validation/structure/ArrayValidationStructure';
import {StringValidationRule} from '../../../utils/th-validation/rules/StringValidationRule';
import {NumberValidationRule} from '../../../utils/th-validation/rules/NumberValidationRule';
import {ThUtils} from '../../../utils/ThUtils';
 
export class SaveYieldFilterValueDO {
    
    filterId: string;
    description: string;
    colorCode: string;
    label: string;
    
    public static getValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "id",
                validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
            },
            {
                key: "filterId",
                validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
            },
            {
                key: "description",
                validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
            },
            {
                key: "colorCode",
                validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
            },
            {
                key: "label",
                validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
            }
        ])
    }
}