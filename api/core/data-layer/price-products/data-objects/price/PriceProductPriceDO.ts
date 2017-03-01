import { BaseDO } from '../../../common/base/BaseDO';
import { ThUtils } from '../../../../utils/ThUtils';
import { PriceProductPriceType, PriceProductPriceQueryDO, IPriceProductPrice } from './IPriceProductPrice';
import { SinglePriceDO } from './single-price/SinglePriceDO';
import { PricePerPersonDO } from './price-per-person/PricePerPersonDO';
import { RoomCategoryStatsDO } from '../../../room-categories/data-objects/RoomCategoryStatsDO';

import _ = require('underscore');

export class PriceProductPriceDO extends BaseDO implements IPriceProductPrice {
	type: PriceProductPriceType;
	priceList: IPriceProductPrice[];

	protected getPrimitivePropertyKeys(): string[] {
		return ["type"];
	}

	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.priceList = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "priceList"), (priceObject: Object) => {
			var price: IPriceProductPrice;
			switch (this.type) {
				case PriceProductPriceType.SinglePrice:
					price = new SinglePriceDO();
					break;
				case PriceProductPriceType.PricePerPerson:
					price = new PricePerPersonDO();
					break;
			}
			price.buildFromObject(priceObject);
			this.priceList.push(price);
		});
	}
	public hasPriceConfiguredFor(query: PriceProductPriceQueryDO): boolean {
		var priceItem: IPriceProductPrice = this.getPriceForSingleRoomCategory(query.roomCategoryId);
		if (!priceItem) {
			return false;
		}
		return priceItem.hasPriceConfiguredFor(query);
	}
	public getPricePerNightFor(query: PriceProductPriceQueryDO): number {
		var priceItem: IPriceProductPrice = this.getPriceForSingleRoomCategory(query.roomCategoryId);
		return priceItem.getPricePerNightFor(query);
	}
	private getPriceForSingleRoomCategory(roomCategoryId: string): IPriceProductPrice {
		return _.find(this.priceList, (price: IPriceProductPrice) => { return price.isConfiguredForRoomCategory(roomCategoryId) });
	}

	public priceConfigurationIsValidFor(roomCategoryStatList: RoomCategoryStatsDO[]): boolean {
		var isValid = true;
		roomCategoryStatList.forEach((roomCategoryStat: RoomCategoryStatsDO) => {
			if (!this.priceConfigurationIsValidForSingleRoomCategoryId(roomCategoryStatList, roomCategoryStat.roomCategory.id)) {
				isValid = false;
			}
		});
		return isValid;
	}
	private priceConfigurationIsValidForSingleRoomCategoryId(roomCategoryStatList: RoomCategoryStatsDO[], roomCategoryId: string): boolean {
		var thUtils = new ThUtils();
		var priceItem: IPriceProductPrice = this.getPriceForSingleRoomCategory(roomCategoryId);
		if (thUtils.isUndefinedOrNull(priceItem)) {
			return false;
		}
		return priceItem.priceConfigurationIsValidFor(roomCategoryStatList);
	}

	public isConfiguredForRoomCategory(roomCategoryId: string): boolean {
		var thUtils = new ThUtils();
		var priceItem: IPriceProductPrice = this.getPriceForSingleRoomCategory(roomCategoryId);
		return !thUtils.isUndefinedOrNull(priceItem);
	}

	public roundPricesToTwoDecimals() {
		_.forEach(this.priceList, (price: IPriceProductPrice) => {
			price.roundPricesToTwoDecimals();
		});
	}
}