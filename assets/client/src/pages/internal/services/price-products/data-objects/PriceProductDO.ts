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
	notes: string;

	constructor() {
		super();
		this.setDefaults();
	}
	private setDefaults() {
		this.name = "";
		this.availability = PriceProductAvailability.Public;
		this.lastRoomAvailability = false;
	}

	protected getPrimitivePropertyKeys(): string[] {
		return ["id", "versionId", "status", "name", "availability", "lastRoomAvailability", "addOnProductIdList", "roomCategoryIdList", "taxIdList", "notes"];
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
	public isDraft(): boolean {
		return this.status === PriceProductStatus.Draft;
	}
	public isActive(): boolean {
		return this.status === PriceProductStatus.Active;
	}
	public isArchived(): boolean {
		return this.status === PriceProductStatus.Archived;
	}
	public containsRoomCategoryId(roomCategoryId: string): boolean {
		return _.contains(this.roomCategoryIdList, roomCategoryId);
	}
}