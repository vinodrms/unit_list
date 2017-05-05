import {IValidationStructure} from '../../../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../../../utils/th-validation/structure/PrimitiveValidationStructure';
import {StringValidationRule} from '../../../../utils/th-validation/rules/StringValidationRule';
import {BookingValidationStructures} from '../../../bookings/validators/BookingValidationStructures';
import {ConfigCapacityDO} from '../../../../data-layer/common/data-objects/bed-config/ConfigCapacityDO';

export class BookingChangeCapacityDO {
    groupBookingId: string;
    id: string;
    configCapacity: ConfigCapacityDO;

    public static getValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "groupBookingId",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            },
            {
                key: "id",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            },
            {
                key: "configCapacity",
                validationStruct: BookingValidationStructures.getConfigCapacityDOValidationStructure()
            }
        ]);
    }
}