import { BaseDO } from '../../common/base/BaseDO';
import { PriceProductPriceDO } from './price/PriceProductPriceDO';
import { ThDateIntervalDO } from '../../../utils/th-dates/data-objects/ThDateIntervalDO';
import { PriceProductConstraintWrapperDO } from './constraint/PriceProductConstraintWrapperDO';
import { PriceProductConditionsDO } from './conditions/PriceProductConditionsDO';
import { PriceProductYieldFilterMetaDO } from './yield-filter/PriceProductYieldFilterDO';
import { PriceProductIncludedItemsDO } from './included-items/PriceProductIncludedItemsDO';
import { PriceProductDiscountWrapperDO } from "./discount/PriceProductDiscountWrapperDO";

import _ = require('underscore');

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

	/**
	 * If the `parentId` is set, then this Price Product instance will always read the following properties:
	 *   a. `price` property (PriceProductPriceDO)
	 *   b. `roomCategoryIdList` property
	 * from its parent Price Product; this minimizes the users' effort to yield various dynamic prices or duplicate prices
	 */
	parentId: string;

	name: string;
	availability: PriceProductAvailability;
	lastRoomAvailability: boolean;
	includedItems: PriceProductIncludedItemsDO;
	roomCategoryIdList: string[];
	price: PriceProductPriceDO;
	taxIdList: string[];
	openIntervalList: ThDateIntervalDO[];
	openForArrivalIntervalList: ThDateIntervalDO[];
	openForDepartureIntervalList: ThDateIntervalDO[];
	yieldFilterList: PriceProductYieldFilterMetaDO[];
	constraints: PriceProductConstraintWrapperDO;
	discounts: PriceProductDiscountWrapperDO;
	conditions: PriceProductConditionsDO;
	notes: string;

	protected getPrimitivePropertyKeys(): string[] {
		return ["id", "hotelId", "versionId", "status", "parentId", "name", "availability", "lastRoomAvailability", "roomCategoryIdList", "taxIdList", "notes"];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.includedItems = new PriceProductIncludedItemsDO();
		this.includedItems.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "includedItems"));

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

		this.discounts = new PriceProductDiscountWrapperDO();
		this.discounts.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "discounts"));

		this.conditions = new PriceProductConditionsDO();
		this.conditions.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "conditions"));
	}
	private buildListOfIntervals(object: Object, objectKey: string): ThDateIntervalDO[] {
		var intervalList: ThDateIntervalDO[] = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, objectKey), (intervalObject: Object) => {
			var intervalDO = new ThDateIntervalDO();
			intervalDO.buildFromObject(intervalObject);
			intervalList.push(intervalDO);
		});
		return intervalList;
	}
	public containsRoomCategoryId(roomCategoryId: string): boolean {
		return _.contains(this.roomCategoryIdList, roomCategoryId);
	}
	public prepareForClient() {
		delete this.openForArrivalIntervalList;
		delete this.openForDepartureIntervalList;
		delete this.openIntervalList;
	}
	public hasParent(): boolean {
		return _.isString(this.parentId) && !_.isEmpty(this.parentId);
	}
	public deleteReferenceToParent() {
		this.parentId = "";
	}
}