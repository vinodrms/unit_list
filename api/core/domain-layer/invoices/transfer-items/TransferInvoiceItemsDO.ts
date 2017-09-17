import { IValidationStructure } from "../../../utils/th-validation/structure/core/IValidationStructure";
import { ObjectValidationStructure } from "../../../utils/th-validation/structure/ObjectValidationStructure";
import { ArrayValidationStructure } from "../../../utils/th-validation/structure/ArrayValidationStructure";
import { PrimitiveValidationStructure } from "../../../utils/th-validation/structure/PrimitiveValidationStructure";
import { StringValidationRule } from "../../../utils/th-validation/rules/StringValidationRule";

export interface Transfer {
    sourceInvoiceId: string;
    destinationInvoiceId: string;
    transactionId: string;
}

export class TransferInvoiceItemsDO {
    transfers: Transfer[];

    public static getValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "transfers",
                validationStruct: new ArrayValidationStructure(new ObjectValidationStructure([
                    {
                        key: "sourceInvoiceId",
                        validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
                    },
                    {
                        key: "destinationInvoiceId",
                        validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
                    },
                    {
                        key: "transactionId",
                        validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
                    },
                ]))
            },
        ]);
    }
}
