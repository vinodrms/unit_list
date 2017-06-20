import { IValidationStructure } from '../../../../utils/th-validation/structure/core/IValidationStructure';
import { ObjectValidationStructure } from '../../../../utils/th-validation/structure/ObjectValidationStructure';
import { PrimitiveValidationStructure } from '../../../../utils/th-validation/structure/PrimitiveValidationStructure';
import { ArrayValidationStructure } from '../../../../utils/th-validation/structure/ArrayValidationStructure';
import { StringValidationRule } from '../../../../utils/th-validation/rules/StringValidationRule';
import { FileAttachmentDO } from '../../../../data-layer/common/data-objects/file/FileAttachmentDO';
import { TravelActivityType, TravelType } from "../../../../data-layer/bookings/data-objects/BookingDO";
import { NumberInListValidationRule } from "../../../../utils/th-validation/rules/NumberInListValidationRule";

export class BookingChangeDetailsDO {
    groupBookingId: string;
    id: string;
    externalBookingReference: string;
    notes: string;
    invoiceNotes: string;
    fileAttachmentList: FileAttachmentDO[];
    travelActivityType: TravelActivityType;
    travelType: TravelType;

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
                key: "externalBookingReference",
                validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
            },
            {
                key: "notes",
                validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
            },
            {
                key: "invoiceNotes",
                validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
            },
            {
                key: "fileAttachmentList",
                validationStruct: new ArrayValidationStructure(new ObjectValidationStructure([
                    {
                        key: "name",
                        validationStruct: new PrimitiveValidationStructure(new StringValidationRule(2000))
                    },
                    {
                        key: "url",
                        validationStruct: new PrimitiveValidationStructure(new StringValidationRule(StringValidationRule.MaxUrlLength))
                    }
                ]))
            },
            {
                key: "travelActivityType",
                validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule([TravelActivityType.Business, TravelActivityType.Leisure]))
            },
            {
                key: "travelType",
                validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule([TravelType.Individual, TravelType.Group]))
            },
        ]);
    }
}