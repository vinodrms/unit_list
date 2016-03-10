import {BaseDO} from '../../../../common/base/BaseDO';
import {IPriceProductPrice, PriceProductPriceQueryDO} from '../IPriceProductPrice';
import {PriceForSingleRoomCategoryDO} from './PriceForSingleRoomCategoryDO';

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
		var priceForRoomCateg: PriceForSingleRoomCategoryDO = _.find(this.priceList, (price: PriceForSingleRoomCategoryDO) => { return price.roomCategoryId === query.roomCategoryId });
		return priceForRoomCateg.price;
	}
}