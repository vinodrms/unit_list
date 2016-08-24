import {BaseDO} from '../../../../common/base/BaseDO';
import {IPriceProductPrice, PriceProductPriceQueryDO} from '../IPriceProductPrice';
import {RoomCategoryStatsDO} from '../../../../room-categories/data-objects/RoomCategoryStatsDO';
import {ThUtils} from '../../../../../utils/ThUtils';
import {NumberValidationRule} from '../../../../../utils/th-validation/rules/NumberValidationRule';

import _ = require("underscore");

export class SinglePriceDO extends BaseDO implements IPriceProductPrice {
	roomCategoryId: string;
	price: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["roomCategoryId", "price"];
	}

	public hasPriceConfiguredFor(query: PriceProductPriceQueryDO): boolean {
		if (query.roomCategoryId === this.roomCategoryId) {
			return true;
		}
		return false;
	}

	public getPricePerNightFor(query: PriceProductPriceQueryDO): number {
		if (query.roomCategoryId === this.roomCategoryId) {
			return this.price;
		}
		return 0;
	}

	public priceConfigurationIsValidFor(roomCategoryStatList: RoomCategoryStatsDO[]): boolean {
		var roomCategStat: RoomCategoryStatsDO = _.find(roomCategoryStatList, (stat: RoomCategoryStatsDO) => {
			return stat.roomCategory.id === this.roomCategoryId;
		});
		if (!roomCategStat) {
			return false;
		}
		return true;
	}
	public isConfiguredForRoomCategory(roomCategoryId: string): boolean {
		return this.roomCategoryId === roomCategoryId;
	}
	public roundPricesToTwoDecimals() {
		var thUtils = new ThUtils();
		this.price = thUtils.roundNumberToTwoDecimals(this.price);
	}
}