import { BaseDO } from '../../../common/base/BaseDO';
import { PriceProductPriceType, PriceProductPriceQueryDO } from './IPriceProductPrice';
import { RoomCategoryStatsDO } from '../../../room-categories/data-objects/RoomCategoryStatsDO';
import { DynamicPriceDO } from './DynamicPriceDO';
import { ThDateDO } from '../../../../utils/th-dates/data-objects/ThDateDO';
import { PricePerDayDO } from "../../../bookings/data-objects/price/PricePerDayDO";

import _ = require('underscore');

export class PriceProductPriceDO extends BaseDO {
	type: PriceProductPriceType;
	dynamicPriceList: DynamicPriceDO[];

	/*
		`index` : the UTC timestamp of the date
		`value` : the id of the dynamic price
		if a dynamic price id does not exist => the first one is used
	*/
	enabledDynamicPriceIdByDate: { [index: number]: string; };

	protected getPrimitivePropertyKeys(): string[] {
		return ["type", "enabledDynamicPriceIdByDate"];
	}

	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.dynamicPriceList = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "dynamicPriceList"), (dynamicPriceObject: Object) => {
			var dynamicPrice = new DynamicPriceDO(this.type);
			dynamicPrice.buildFromObject(dynamicPriceObject);
			this.dynamicPriceList.push(dynamicPrice);
		});
	}

	/**
	 * Returns whether the price product has prices defined for the roomCategoryId from the query
	 */
	public hasPriceConfiguredFor(query: PriceProductPriceQueryDO): boolean {
		for (var i = 0; i < this.dynamicPriceList.length; i++) {
			let dynamicPrice = this.dynamicPriceList[i];
			if (!dynamicPrice.hasPriceConfiguredFor(query)) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Returns the breakdown of all the prices for each night with the according exceptions and dynamic rates
	 */
	public getPricePerDayBreakdownFor(query: PriceProductPriceQueryDO): PricePerDayDO[] {
		let priceList: PricePerDayDO[] = [];
		_.forEach(query.bookingInterval.bookingDateList, (bookingDate: ThDateDO) => {
			let dynamicPrice = this.getEnabledDynamicPriceForDate(bookingDate);

			let price = new PricePerDayDO();
			price.thDate = bookingDate;
			price.dynamicPriceId = dynamicPrice.id;
			price.price = dynamicPrice.getPriceForDate(query, bookingDate);

			priceList.push(price);
		});
		return priceList;
	}
	public getEnabledDynamicPriceForDate(thDate: ThDateDO): DynamicPriceDO {
		let dynamicPriceId = this.enabledDynamicPriceIdByDate[thDate.getUtcTimestamp()];
		// if the date is not indexed we return the default dynamic price
		if (!dynamicPriceId) {
			return this.getDefaultDynamicPrice();
		}
		let dynamicPrice = _.find(this.dynamicPriceList, dynamicPrice => { return dynamicPrice.id === dynamicPriceId; });
		// if the dynamic price was not found we return the default dynamic price
		if (!dynamicPrice) {
			return this.getDefaultDynamicPrice();
		}
		return dynamicPrice;
	}
	private getDefaultDynamicPrice(): DynamicPriceDO {
		return this.dynamicPriceList[0];
	}
	public enableDynamicPriceForDate(dynamicPrice: DynamicPriceDO, thDate: ThDateDO) {
		let defaultDynamicPrice = this.getDefaultDynamicPrice();
		if (dynamicPrice.id === defaultDynamicPrice.id) {
			delete this.enabledDynamicPriceIdByDate[thDate.getUtcTimestamp()];
		}
		else {
			this.enabledDynamicPriceIdByDate[thDate.getUtcTimestamp()] = dynamicPrice.id;
		}
	}

	/**
	 * Validates whether the prices contain all the values in relation with the people that can fit in a room category 
	 */
	public priceConfigurationIsValidFor(roomCategoryStatList: RoomCategoryStatsDO[]): boolean {
		for (var i = 0; i < this.dynamicPriceList.length; i++) {
			let dynamicPrice = this.dynamicPriceList[i];
			if (!dynamicPrice.priceConfigurationIsValidFor(roomCategoryStatList)) {
				return false;
			}
		}
		return true;
	}

	public roundPricesToTwoDecimals() {
		_.forEach(this.dynamicPriceList, dynamicPrice => {
			dynamicPrice.roundPricesToTwoDecimals();
		});
	}

	public getDynamicPriceById(dynamicPriceId: string): DynamicPriceDO {
		return _.find(this.dynamicPriceList, dynamicPrice => {
			return dynamicPrice.id === dynamicPriceId;
		});
	}

	public getRoomCategoryIdList(): string[] {
		// all the dynamic rates have prices defined for the same room category ids
		return this.dynamicPriceList[0].getRoomCategoryIdList();
	}
}