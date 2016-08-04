import {IValidationStructure} from '../../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../../utils/th-validation/structure/ObjectValidationStructure';
import {BookingValidationStructures} from '../../bookings/validators/BookingValidationStructures';
import {ThDateIntervalDO} from '../../../utils/th-dates/data-objects/ThDateIntervalDO';

export class PriceProductReaderDO {
    interval: ThDateIntervalDO;

    public static getValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "interval",
                validationStruct: BookingValidationStructures.getThDateIntervalDOValidationStructure()
            }
        ]);
    }
}