import {IValidationStructure} from '../../../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../../../utils/th-validation/structure/PrimitiveValidationStructure';
import {StringValidationRule} from '../../../../utils/th-validation/rules/StringValidationRule';
import {BookingValidationStructures} from '../../../bookings/validators/BookingValidationStructures';
import {ThTimestampDO} from '../../../../utils/th-dates/data-objects/ThTimestampDO';

export class BookingChangeNoShowTimeDO {
    groupBookingId: string;
    bookingId: string;
    noShowTimestamp: ThTimestampDO;

    public static getValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "groupBookingId",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            },
            {
                key: "bookingId",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            },
            {
                key: "noShowTimestamp",
                validationStruct: BookingValidationStructures.getThTimestampDOValidationStructure()
            }
        ]);
    }
}