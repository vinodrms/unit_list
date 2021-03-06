import { BaseDO } from "../../../../../../common/base/BaseDO";
import { ThDateIntervalDO } from "../../../common/data-objects/th-dates/ThDateIntervalDO";

export class PriceProductDiscountIntervalWrapperDO extends BaseDO {
    intervalList: ThDateIntervalDO[];

    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.intervalList = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "intervalList"), (intervalObject: Object) => {
			var dateIntervalDO = new ThDateIntervalDO();
			dateIntervalDO.buildFromObject(intervalObject);
			this.intervalList.push(dateIntervalDO);
		});
    }
    
}