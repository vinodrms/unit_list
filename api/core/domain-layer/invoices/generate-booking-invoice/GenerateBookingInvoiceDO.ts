import { IValidationStructure } from "../../../utils/th-validation/structure/core/IValidationStructure";
import { ObjectValidationStructure } from "../../../utils/th-validation/structure/ObjectValidationStructure";
import { PrimitiveValidationStructure } from "../../../utils/th-validation/structure/PrimitiveValidationStructure";
import { StringValidationRule } from "../../../utils/th-validation/rules/StringValidationRule";
import { BooleanValidationRule } from "../../../utils/th-validation/rules/BooleanValidationRule";
import { AddOnProductSnapshotDO } from "../../../data-layer/add-on-products/data-objects/AddOnProductSnapshotDO";

export interface BookingInvoiceItem {
    addOnProductSnapshot: AddOnProductSnapshotDO;
    noOfItems: number;
}

export class GenerateBookingInvoiceDO {
    groupBookingId: string;
    id: string;

    constructor(id: string, groupBookingId: string) {
        this.id = id;
        this.groupBookingId = groupBookingId;
    }

    public static getValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "groupBookingId",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            },
            {
                key: "id",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            }
        ]);
    }
}
