import {IValidationStructure} from '../../../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../../../utils/th-validation/structure/PrimitiveValidationStructure';
import {StringValidationRule} from '../../../../utils/th-validation/rules/StringValidationRule';
import {NumberInListValidationRule} from '../../../../utils/th-validation/rules/NumberInListValidationRule';
import {RoomMaintenanceStatus} from '../../../../data-layer/rooms/data-objects/RoomDO';

export class ChangeRoomMaintenanceStatusDO {
    id: string;
    maintenanceStatus: RoomMaintenanceStatus;
    maintenanceMessage: string;

    public static getValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "id",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            },
            {
                key: "maintenanceStatus",
                validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule([RoomMaintenanceStatus.Clean, RoomMaintenanceStatus.Dirty,
                    RoomMaintenanceStatus.PickUp, RoomMaintenanceStatus.OutOfOrder, RoomMaintenanceStatus.OutOfService]))
            },
            {
                key: "maintenanceMessage",
                validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
            }
        ]);
    }
}