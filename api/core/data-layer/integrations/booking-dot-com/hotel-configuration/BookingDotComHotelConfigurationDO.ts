import { BaseDO } from "../../../common/base/BaseDO";
import { IValidationStructure } from "../../../../utils/th-validation/structure/core/IValidationStructure";
import { ObjectValidationStructure } from "../../../../utils/th-validation/structure/ObjectValidationStructure";
import { PrimitiveValidationStructure } from "../../../../utils/th-validation/structure/PrimitiveValidationStructure";
import { StringValidationRule } from "../../../../utils/th-validation/rules/StringValidationRule";

export class BookingDotComHotelConfigurationDO extends BaseDO {
    hotelId: string;

    protected getPrimitivePropertyKeys(): string[] {
        return ["hotelId"];
    }

    public static getValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "hotelId",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            },
        ]);
    }
}