import {IValidationStructure} from '../../../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../../../utils/th-validation/structure/PrimitiveValidationStructure';
import {ArrayValidationStructure} from '../../../../utils/th-validation/structure/ArrayValidationStructure';
import {StringValidationRule} from '../../../../utils/th-validation/rules/StringValidationRule';
import {FileAttachmentDO} from '../../../../data-layer/common/data-objects/file/FileAttachmentDO';

export class BookingChangeDetailsDO {
    groupBookingId: string;
    bookingId: string;
    externalBookingReference: string;
    notes: string;
    invoiceNotes: string;
    fileAttachmentList: FileAttachmentDO[];

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
        ]);
    }
}