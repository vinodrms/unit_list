import { IValidationStructure } from "../../../../utils/th-validation/structure/core/IValidationStructure";
import { ObjectValidationStructure } from "../../../../utils/th-validation/structure/ObjectValidationStructure";
import { PrimitiveValidationStructure } from "../../../../utils/th-validation/structure/PrimitiveValidationStructure";
import { StringValidationRule } from "../../../../utils/th-validation/rules/StringValidationRule";
import { ArrayValidationStructure } from "../../../../utils/th-validation/structure/ArrayValidationStructure";

export class BookingChangeGuestOnInvoiceDO {
    groupBookingId: string;
    id: string;
    customerIdDisplayedOnInvoice: string;

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
                key: "customerIdDisplayedOnInvoice",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            }
        ]);
    }
}