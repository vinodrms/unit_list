import {ThDateIntervalDO} from '../../../utils/th-dates/data-objects/ThDateIntervalDO';
import {ConfigCapacityDO} from '../../../data-layer/common/data-objects/bed-config/ConfigCapacityDO';
import {BookingValidationStructures} from '../validators/BookingValidationStructures';
import {IValidationStructure} from '../../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../../utils/th-validation/structure/PrimitiveValidationStructure';
import {StringValidationRule} from '../../../utils/th-validation/rules/StringValidationRule';

export class BookingSearchDO {
    customerId: string;
    interval: ThDateIntervalDO;
    configCapacity: ConfigCapacityDO;

    public static getValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "customerId",
                validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
            },
            {
                key: "interval",
                validationStruct: BookingValidationStructures.getThDateIntervalDOValidationStructure()
            },
            {
                key: "configCapacity",
                validationStruct: BookingValidationStructures.getConfigCapacityDOValidationStructure()
            }
        ]);
    }
}