import { BaseDO } from "../../../../../../../../../../../../../../common/base/BaseDO";

export class BookingDotComPriceProductConfigurationDO extends BaseDO {
    
    public priceProductId: string;
    public rateCategoryId: string;
    public enabled: boolean;

    protected getPrimitivePropertyKeys(): string[] {
        return ["priceProductId","rateCategoryId", "enabled"];
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
}