import { BaseDO } from "../../../common/base/BaseDO";
import { IValidationStructure } from "../../../../utils/th-validation/structure/core/IValidationStructure";
import { ObjectValidationStructure } from "../../../../utils/th-validation/structure/ObjectValidationStructure";
import { ArrayValidationStructure } from "../../../../utils/th-validation/structure/ArrayValidationStructure";
import { StringValidationRule } from "../../../../utils/th-validation/rules/StringValidationRule";
import { BooleanValidationRule } from "../../../../utils/th-validation/rules/BooleanValidationRule";
import { PrimitiveValidationStructure } from "../../../../utils/th-validation/structure/PrimitiveValidationStructure";

export class BookingDotComRoomConfigurationDO extends BaseDO {
    
    public ourRoomId: string;
    public roomId: string;

    protected getPrimitivePropertyKeys(): string[] {
        return ["ourRoomId","roomId"];
    }

    public static getValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "ourRoomId",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            },
            {
                key: "roomId",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            },
        ]);
    }
}

export class BookingDotComRoomConfigurationsDO extends BaseDO {
    roomConfigurations: BookingDotComRoomConfigurationDO[];

    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }

    public buildFromObject(object: Object) {
        this.roomConfigurations = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "roomConfigurations"), (roomConfigurationObject: Object) => {
            var roomConfigurationDO = new BookingDotComRoomConfigurationDO();
            roomConfigurationDO.buildFromObject(roomConfigurationObject);
            this.roomConfigurations.push(roomConfigurationDO);
        });
    }

    public static getValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "roomConfigurations",
                validationStruct: new ArrayValidationStructure(BookingDotComRoomConfigurationDO.getValidationStructure())
            },
        ]);
    }
}