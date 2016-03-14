import {BaseDO} from '../../../../common/base/BaseDO';
import {ThUtils} from '../../../../../utils/ThUtils';
import {IPriceProductPrice, PriceProductPriceQueryDO} from '../IPriceProductPrice';
import {PriceForFixedNumberOfPersonsDO} from './PriceForFixedNumberOfPersonsDO';
import {RoomCategoryStatsDO} from '../../../../room-categories/data-objects/RoomCategoryStatsDO';
import {NumberValidationRule} from '../../../../../utils/th-validation/rules/NumberValidationRule';

import _ = require("underscore");

export class PricePerPersonDO extends BaseDO implements IPriceProductPrice {
	adultsPriceList: PriceForFixedNumberOfPersonsDO[];
	childrenPriceList: PriceForFixedNumberOfPersonsDO[];
	defaultPrice: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["defaultPrice"];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.adultsPriceList = this.buildPriceList(object, "adultsPriceList");
		this.childrenPriceList = this.buildPriceList(object, "childrenPriceList");
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
		var childrenPrice = this.getPriceForNumberOfPersons(this.childrenPriceList, query.noOfChildren);
		var thUtils = new ThUtils();
		if (thUtils.isUndefinedOrNull(adultsPrice) || thUtils.isUndefinedOrNull(childrenPrice)) {
			return this.defaultPrice;
		}
		return adultsPrice.price + childrenPrice.price;
	}
	private getPriceForNumberOfPersons(priceList: PriceForFixedNumberOfPersonsDO[], noOfPersons: number): PriceForFixedNumberOfPersonsDO {
		return _.find(priceList, (price: PriceForFixedNumberOfPersonsDO) => { return price.noOfPersons === noOfPersons });
	}

	public priceConfigurationIsValidFor(roomCategoryStatList: RoomCategoryStatsDO[]): boolean {
		var maxNoOfAdults: number = _.max(roomCategoryStatList, (stat: RoomCategoryStatsDO) => { return stat.maxNoAdults }).maxNoAdults;
		if (!this.priceListIsValidForMaxNoOfPersons(this.adultsPriceList, maxNoOfAdults)) {
			return false;
		}

		var maxNoOfChildren = _.max(roomCategoryStatList, (stat: RoomCategoryStatsDO) => { return stat.maxNoChildren }).maxNoChildren;
		return this.priceListIsValidForMaxNoOfPersons(this.childrenPriceList, maxNoOfChildren);
	}
	private priceListIsValidForMaxNoOfPersons(priceList: PriceForFixedNumberOfPersonsDO[], maxNoOfPersons: number): boolean {
		var thUtils = new ThUtils();
		for (var noOfPersons = 1; noOfPersons <= maxNoOfPersons; noOfPersons++) {
			var priceForFixedNumberOfPersons = this.getPriceForNumberOfPersons(priceList, noOfPersons);
			if (thUtils.isUndefinedOrNull(priceForFixedNumberOfPersons)) {
				return false;
			}
			var priceRule = NumberValidationRule.buildPriceNumberRule();
			if (!priceRule.validate(priceForFixedNumberOfPersons.price).isValid()) {
				return false;
			}
		}
		return true;
	}
}