import { IValidationStructure } from '../../../../utils/th-validation/structure/core/IValidationStructure';
import { ObjectValidationStructure } from '../../../../utils/th-validation/structure/ObjectValidationStructure';
import { PrimitiveValidationStructure } from '../../../../utils/th-validation/structure/PrimitiveValidationStructure';
import { StringValidationRule } from '../../../../utils/th-validation/rules/StringValidationRule';

export class BookingChangePriceProductDO {
    groupBookingId: string;
    bookingId: string;
    roomCategoryId: string;
    priceProductId: string;
    allotmentId: string;

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
                key: "roomCategoryId",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            },
            {
                key: "priceProductId",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            },
            {
                key: "allotmentId",
                validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
            }
        ]);
    }
}