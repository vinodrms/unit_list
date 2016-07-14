import {ThDateDO} from '../../../../utils/th-dates/data-objects/ThDateDO';
import {BookingValidationStructures} from '../../../bookings/validators/BookingValidationStructures';
import {IValidationStructure} from '../../../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../../../utils/th-validation/structure/ObjectValidationStructure';

export class HotelOperationsQueryDO {
    referenceDate: ThDateDO;

    public static getValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "referenceDate",
                validationStruct: BookingValidationStructures.getThDateDOValidationStructure()
            }
        ]);
    }
}