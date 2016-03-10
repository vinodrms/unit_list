import {BaseDO} from '../../../../common/base/BaseDO';
import {ThUtils} from '../../../../../utils/ThUtils';
import {IPriceProductPrice, PriceProductPriceQueryDO} from '../IPriceProductPrice';
import {PriceForFixedNumberOfPersonsDO} from './PriceForFixedNumberOfPersonsDO';

import _ = require("underscore");

export class PricePerPersonDO extends BaseDO implements IPriceProductPrice {
	adultsPriceList: PriceForFixedNumberOfPersonsDO[];
	chldrenPriceList: PriceForFixedNumberOfPersonsDO[];
	defaultPrice: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["defaultPrice"];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.adultsPriceList = this.buildPriceList(object, "adultsPriceList");
		this.chldrenPriceList = this.buildPriceList(object, "chldrenPriceList");
	}
	private buildPriceList(object: Object, objectKey: string): PriceForFixedNumberOfPersonsDO[] {
		var priceList: PriceForFixedNumberOfPersonsDO[] = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, objectKey), (priceObject: Object) => {
			var priceDO = new PriceForFixedNumberOfPersonsDO();
			priceDO.buildFromObject(priceObject);
			priceList.push(priceDO);
		});
		return priceList;
	}

	public getPriceFor(query: PriceProductPriceQueryDO): number {
		var adultsPrice = this.getPriceForNumberOfPersons(this.adultsPriceList, query.noOfAdults);
		var childrenPrice = this.getPriceForNumberOfPersons(this.chldrenPriceList, query.noOfChildren);
		var thUtils = new ThUtils();
		if (thUtils.isUndefinedOrNull(adultsPrice) || thUtils.isUndefinedOrNull(childrenPrice)) {
			return this.defaultPrice;
		}
		return adultsPrice.price + childrenPrice.price;
	}
	private getPriceForNumberOfPersons(priceList: PriceForFixedNumberOfPersonsDO[], noOfPersons: number): PriceForFixedNumberOfPersonsDO {
		return _.find(priceList, (price: PriceForFixedNumberOfPersonsDO) => { return price.noOfPersons === noOfPersons });
	}
}