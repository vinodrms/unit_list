import { BaseDO } from "../../../common/base/BaseDO";
import { IValidationStructure } from "../../../../utils/th-validation/structure/core/IValidationStructure";
import { ObjectValidationStructure } from "../../../../utils/th-validation/structure/ObjectValidationStructure";
import { ArrayValidationStructure } from "../../../../utils/th-validation/structure/ArrayValidationStructure";
import { StringValidationRule } from "../../../../utils/th-validation/rules/StringValidationRule";
import { BooleanValidationRule } from "../../../../utils/th-validation/rules/BooleanValidationRule";
import { PrimitiveValidationStructure } from "../../../../utils/th-validation/structure/PrimitiveValidationStructure";

export class BookingDotComPriceProductConfigurationDO extends BaseDO {
    
    public priceProductId: string;
    public rateCategoryId: string;
    public enabled: boolean;

    protected getPrimitivePropertyKeys(): string[] {
        return ["priceProductId","rateCategoryId", "enabled"];
    }

    public static getValidationStructure(): IValidationStructure {
		return new ObjectValidationStructure([
            {
				key: "priceProductId",
				validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            },
			{
				key: "rateCategoryId",
				validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
            },
            {
				key: "enabled",
				validationStruct: new PrimitiveValidationStructure(new BooleanValidationRule())
            },
        ]);
    }
}

export class BookingDotComPriceProductConfigurationsDO extends BaseDO {
    priceProductConfigurations: BookingDotComPriceProductConfigurationDO[];

    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }

    public buildFromObject(object: Object) {
        this.priceProductConfigurations = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "priceProductConfigurations"), (priceProductConfiguration: Object) => {
			var priceProductConfigurationDO = new BookingDotComPriceProductConfigurationDO();
			priceProductConfigurationDO.buildFromObject(priceProductConfiguration);
			this.priceProductConfigurations.push(priceProductConfigurationDO);
		});
    }

    public static getValidationStructure(): IValidationStructure {
		return new ObjectValidationStructure([
			{
				key: "priceProductConfigurations",
				validationStruct: new ArrayValidationStructure(BookingDotComPriceProductConfigurationDO.getValidationStructure())
            },
        ]);
    }
}