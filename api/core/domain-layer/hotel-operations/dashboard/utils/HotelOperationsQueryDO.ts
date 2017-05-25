import { ThDateDO } from '../../../../utils/th-dates/data-objects/ThDateDO';
import { IValidationStructure } from '../../../../utils/th-validation/structure/core/IValidationStructure';
import { ObjectValidationStructure } from '../../../../utils/th-validation/structure/ObjectValidationStructure';
import { CommonValidationStructures } from "../../../common/CommonValidations";

export enum HotelOperationsQueryType {
	RealTime,
	FixedForTheDay
}

export class HotelOperationsQueryDO {
    referenceDate: ThDateDO;

    public static getValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "referenceDate",
                validationStruct: CommonValidationStructures.getThDateDOValidationStructure()
            }
        ]);
    }
}