import { IValidationStructure } from "../../../../utils/th-validation/structure/core/IValidationStructure";
import { ObjectValidationStructure } from "../../../../utils/th-validation/structure/ObjectValidationStructure";
import { PrimitiveValidationStructure } from "../../../../utils/th-validation/structure/PrimitiveValidationStructure";
import { StringValidationRule } from "../../../../utils/th-validation/rules/StringValidationRule";

export class BookingChangeBilledCustomerDO {
    id: string;
    groupBookingId: string;
    customerId: string;

    public static getValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "id",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            },
            {
                key: "groupBookingId",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            },
            {
                key: "customerId",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            },
        ]);
    }
}