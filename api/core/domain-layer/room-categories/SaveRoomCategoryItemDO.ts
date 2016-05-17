import {IValidationStructure} from '../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../utils/th-validation/structure/PrimitiveValidationStructure';
import {StringValidationRule} from '../../utils/th-validation/rules/StringValidationRule';
import {ArrayValidationStructure} from '../../utils/th-validation/structure/ArrayValidationStructure';
import {NumberValidationRule} from '../../utils/th-validation/rules/NumberValidationRule';
import {BedConfigDO} from '../../data-layer/room-categories/data-objects/bed-config/BedConfigDO';

export class SaveRoomCategoryItemDO {
    displayName: string;
    bedConfig: BedConfigDO;

    public static getValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "displayName",
                validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildMinMaxLength(StringValidationRule.MinRoomCategoryLength,
                    StringValidationRule.MaxRoomCategoryLength))
            }
        ])
    }

    public static getBedConfigValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "bedMetaList",
                validationStruct: new ArrayValidationStructure(new ObjectValidationStructure([
                    {
                        key: "bedId",
                        validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
                    },
                    {
                        key: "noOfInstances",
                        validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildIntegerNumberRule(1))
                    }
                ]))
            }
        ]);
    }
}