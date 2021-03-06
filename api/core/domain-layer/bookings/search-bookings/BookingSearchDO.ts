import { ThDateIntervalDO } from '../../../utils/th-dates/data-objects/ThDateIntervalDO';
import { ConfigCapacityDO } from '../../../data-layer/common/data-objects/bed-config/ConfigCapacityDO';
import { BookingValidationStructures } from '../validators/BookingValidationStructures';
import { IValidationStructure } from '../../../utils/th-validation/structure/core/IValidationStructure';
import { ObjectValidationStructure } from '../../../utils/th-validation/structure/ObjectValidationStructure';
import { ArrayValidationStructure } from '../../../utils/th-validation/structure/ArrayValidationStructure';
import { PrimitiveValidationStructure } from '../../../utils/th-validation/structure/PrimitiveValidationStructure';
import { StringValidationRule } from '../../../utils/th-validation/rules/StringValidationRule';
import { TransientBookingItemDO } from './TransientBookingItemDO';
import { CommonValidationStructures } from "../../common/CommonValidations";

export class BookingSearchDO {
    customerId: string;
    interval: ThDateIntervalDO;
    configCapacity: ConfigCapacityDO;
    transientBookingList: TransientBookingItemDO[];
    bookingIdToOmit: string;

    public static getValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "customerId",
                validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
            },
            {
                key: "interval",
                validationStruct: CommonValidationStructures.getThDateIntervalDOValidationStructure()
            },
            {
                key: "configCapacity",
                validationStruct: BookingValidationStructures.getConfigCapacityDOValidationStructure()
            },
            {
                key: "transientBookingList",
                validationStruct: new ArrayValidationStructure(TransientBookingItemDO.getValidationStructure())
            },
            {
                key: "bookingIdToOmit",
                validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
            }
        ]);
    }
}