import {BaseDO} from '../../../../../common/base/BaseDO';
import {PriceProductPriceDO} from './price/PriceProductPriceDO';
import {PriceProductConstraintWrapperDO} from './constraint/PriceProductConstraintWrapperDO';
import {PriceProductConditionsDO} from './conditions/PriceProductConditionsDO';
import {PriceProductYieldFilterMetaDO} from './yield-filter/PriceProductYieldFilterDO';

export enum PriceProductStatus {
	Draft,
	Deleted,
	Active,
	Archived
}

export enum PriceProductAvailability {
	Public,
	Confidential
}

export class PriceProductDO extends BaseDO {
	id: string;
	versionId: number;
	status: PriceProductStatus;
	name: string;
	availability: PriceProductAvailability;
	lastRoomAvailability: boolean;
	addOnProductIdList: string[];
	roomCategoryIdList: string[];
	price: PriceProductPriceDO;
	taxIdList: string[];
	yieldFilterList: PriceProductYieldFilterMetaDO[];
	constraints: PriceProductConstraintWrapperDO;
	conditions: PriceProductConditionsDO;

	protected getPrimitivePropertyKeys(): string[] {
		return ["id", "versionId", "status", "name", "availability", "lastRoomAvailability", "addOnProductIdList", "roomCategoryIdList", "taxIdList"];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.price = new PriceProductPriceDO();
		this.price.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "price"));

		this.yieldFilterList = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "yieldFilterList"), (yieldFilterObject: Object) => {
			var yieldFilterDO = new PriceProductYieldFilterMetaDO();
			yieldFilterDO.buildFromObject(yieldFilterObject);
			this.yieldFilterList.push(yieldFilterDO);
		});

		this.constraints = new PriceProductConstraintWrapperDO();
		this.constraints.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "constraints"));

		this.conditions = new PriceProductConditionsDO();
		this.conditions.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "conditions"));
	}
}