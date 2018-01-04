import { BaseDO } from "../../../common/base/BaseDO";
import { IValidationStructure } from "../../../../utils/th-validation/structure/core/IValidationStructure";
import { ObjectValidationStructure } from "../../../../utils/th-validation/structure/ObjectValidationStructure";
import { ArrayValidationStructure } from "../../../../utils/th-validation/structure/ArrayValidationStructure";
import { StringValidationRule } from "../../../../utils/th-validation/rules/StringValidationRule";
import { BooleanValidationRule } from "../../../../utils/th-validation/rules/BooleanValidationRule";
import { PrimitiveValidationStructure } from "../../../../utils/th-validation/structure/PrimitiveValidationStructure";

export class BookingDotComRoomCategoryConfigurationDO extends BaseDO {
    
    public ourRoomCategoryId: string;
    public roomId: string;

    protected getPrimitivePropertyKeys(): string[] {
        return ["ourRoomCategoryId","roomId"];
    }

    public static getValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "ourRoomCategoryId",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            },
            {
                key: "roomId",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            },
        ]);
    }
}

export class BookingDotComRoomCategoryConfigurationsDO extends BaseDO {
    roomCategoryConfigurations: BookingDotComRoomCategoryConfigurationDO[];

    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }

    public buildFromObject(object: Object) {
        this.roomCategoryConfigurations = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "roomCategoryConfigurations"), (roomCategoryConfigurationObject: Object) => {
            var roomCategoryConfigurationDO = new BookingDotComRoomCategoryConfigurationDO();
            roomCategoryConfigurationDO.buildFromObject(roomCategoryConfigurationObject);
            this.roomCategoryConfigurations.push(roomCategoryConfigurationDO);
        });
    }

    public static getValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "roomCategoryConfigurations",
                validationStruct: new ArrayValidationStructure(BookingDotComRoomCategoryConfigurationDO.getValidationStructure())
            },
        ]);
    }
}