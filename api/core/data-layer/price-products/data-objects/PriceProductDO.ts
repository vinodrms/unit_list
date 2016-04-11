import {BaseDO} from '../../common/base/BaseDO';
import {PriceProductPriceDO} from './price/PriceProductPriceDO';
import {ThDayInYearIntervalDO} from '../../../utils/th-dates/data-objects/ThDayInYearIntervalDO';
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
	hotelId: string;
	versionId: number;
	status: PriceProductStatus;
	name: string;
	availability: PriceProductAvailability;
	lastRoomAvailability: boolean;
	addOnProductIdList: string[];
	roomCategoryIdList: string[];
	price: PriceProductPriceDO;
	taxIdList: string[];
	openIntervalList: ThDayInYearIntervalDO[];
	openForArrivalIntervalList: ThDayInYearIntervalDO[];
	openForDepartureIntervalList: ThDayInYearIntervalDO[];
	yieldFilterList: PriceProductYieldFilterMetaDO[];
	constraints: PriceProductConstraintWrapperDO;
	conditions: PriceProductConditionsDO;

	protected getPrimitivePropertyKeys(): string[] {
		return ["id", "hotelId", "versionId", "status", "name", "availability", "lastRoomAvailability", "addOnProductIdList", "roomCategoryIdList", "taxIdList"];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.price = new PriceProductPriceDO();
		this.price.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "price"));

		this.openIntervalList = this.buildListOfIntervals(object, "openIntervalList");
		this.openForArrivalIntervalList = this.buildListOfIntervals(object, "openForArrivalIntervalList");
		this.openForDepartureIntervalList = this.buildListOfIntervals(object, "openForDepartureIntervalList");

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
	private buildListOfIntervals(object: Object, objectKey: string): ThDayInYearIntervalDO[] {
		var intervalList: ThDayInYearIntervalDO[] = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, objectKey), (intervalObject: Object) => {
			var intervalDO = new ThDayInYearIntervalDO();
			intervalDO.buildFromObject(intervalObject);
			intervalList.push(intervalDO);
		});
		return intervalList;
	}
}