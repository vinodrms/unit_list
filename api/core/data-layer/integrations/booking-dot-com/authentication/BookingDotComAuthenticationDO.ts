import { BaseDO } from "../../../common/base/BaseDO";
import { IValidationStructure } from "../../../../utils/th-validation/structure/core/IValidationStructure";
import { ObjectValidationStructure } from "../../../../utils/th-validation/structure/ObjectValidationStructure";
import { PrimitiveValidationStructure } from "../../../../utils/th-validation/structure/PrimitiveValidationStructure";
import { StringValidationRule } from "../../../../utils/th-validation/rules/StringValidationRule";

export class BookingDotComAuthenticationDO extends BaseDO {
    accountName: string;
    accountId: string;
    accountPassword: string;

    protected getPrimitivePropertyKeys(): string[] {
        return ["accountName", "accountId", "accountPassword"];
    }

    public static getValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "accountName",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            },
            {
                key: "accountId",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            },
            {
                key: "accountPassword",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            },
        ]);
    }
}