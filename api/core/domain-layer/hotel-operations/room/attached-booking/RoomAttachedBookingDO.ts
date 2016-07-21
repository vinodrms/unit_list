import {IValidationStructure} from '../../../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../../../utils/th-validation/structure/PrimitiveValidationStructure';
import {StringValidationRule} from '../../../../utils/th-validation/rules/StringValidationRule';

export class RoomAttachedBookingDO {
    roomId: string;

    constructor(roomId: string) {
        this.roomId = roomId;
    }

    public static getValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "roomId",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            }
        ]);
    }
}