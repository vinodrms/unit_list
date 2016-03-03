import {IValidationStructure} from '../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../utils/th-validation/structure/PrimitiveValidationStructure';
import {StringValidationRule} from '../../utils/th-validation/rules/StringValidationRule';

export class SaveRoomCategoryItemDO {
    hotelId: string;
    displayName: string;

    public static getValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "id",
                validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
            },
            {
                key: "hotelId",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            },
            {
                key: "displayName",
                validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildMinMaxLength(StringValidationRule.MinRoomCategoryLength,
                    StringValidationRule.MaxRoomCategoryLength))
            }
        ])
    }
}