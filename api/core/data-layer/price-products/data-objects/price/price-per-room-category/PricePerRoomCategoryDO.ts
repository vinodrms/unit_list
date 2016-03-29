import {BaseDO} from '../../../../common/base/BaseDO';
import {IPriceProductPrice, PriceProductPriceQueryDO} from '../IPriceProductPrice';
import {PriceForSingleRoomCategoryDO} from './PriceForSingleRoomCategoryDO';
import {RoomCategoryStatsDO} from '../../../../room-categories/data-objects/RoomCategoryStatsDO';
import {ThUtils} from '../../../../../utils/ThUtils';
import {NumberValidationRule} from '../../../../../utils/th-validation/rules/NumberValidationRule';

import _ = require("underscore");

export class PricePerRoomCategoryDO extends BaseDO implements IPriceProductPrice {
	priceList: PriceForSingleRoomCategoryDO[];

	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.priceList = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "priceList"), (priceObject: Object) => {
			var priceDO = new PriceForSingleRoomCategoryDO();
			priceDO.buildFromObject(priceObject);
			this.priceList.push(priceDO);
		});
	}

	public getPriceFor(query: PriceProductPriceQueryDO): number {
		var priceForRoomCateg: PriceForSingleRoomCategoryDO = this.getPriceForSingleRoomCategory(query.roomCategoryId);
		return priceForRoomCateg.price;
	}
	private getPriceForSingleRoomCategory(roomCategoryId: string): PriceForSingleRoomCategoryDO {
		return _.find(this.priceList, (price: PriceForSingleRoomCategoryDO) => { return price.roomCategoryId === roomCategoryId });
	}

	public priceConfigurationIsValidFor(roomCategoryStatList: RoomCategoryStatsDO[]): boolean {
		var isValid = true;
		roomCategoryStatList.forEach((roomCategoryStat: RoomCategoryStatsDO) => {
			if (!this.priceConfigurationIsValidForSingleRoomCategoryId(roomCategoryStat.roomCategory.id)) {
				isValid = false;
			}
		});
		return isValid;
	}
	private priceConfigurationIsValidForSingleRoomCategoryId(roomCategoryId: string): boolean {
		var thUtils = new ThUtils();
		var priceForRoomCateg: PriceForSingleRoomCategoryDO = this.getPriceForSingleRoomCategory(roomCategoryId);
		if (thUtils.isUndefinedOrNull(priceForRoomCateg)) {
			return false;
		}
		var priceRule = NumberValidationRule.buildPriceNumberRule();
		return priceRule.validate(priceForRoomCateg.price).isValid();
	}
}