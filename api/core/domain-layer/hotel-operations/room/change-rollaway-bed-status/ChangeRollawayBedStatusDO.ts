import {IValidationStructure} from '../../../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../../../utils/th-validation/structure/PrimitiveValidationStructure';
import {StringValidationRule} from '../../../../utils/th-validation/rules/StringValidationRule';
import {NumberInListValidationRule} from '../../../../utils/th-validation/rules/NumberInListValidationRule';
import {RollawayBedStatus} from '../../../../data-layer/rooms/data-objects/RoomDO';

export class ChangeRollawayBedStatusDO {
    id: string;
    rollawayBedStatus: RollawayBedStatus;

    public static getValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "id",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            },
            {
                key: "rollawayBedStatus",
                validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule([RollawayBedStatus.NoRollawayBeds, RollawayBedStatus.RollawayBedsInside]))
            }
        ]);
    }
}