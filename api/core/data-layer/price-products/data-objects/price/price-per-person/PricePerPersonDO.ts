import {BaseDO} from '../../../../common/base/BaseDO';
import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {ThUtils} from '../../../../../utils/ThUtils';
import {IPriceProductPrice, PriceProductPriceQueryDO} from '../IPriceProductPrice';
import {PriceForFixedNumberOfPersonsDO} from './PriceForFixedNumberOfPersonsDO';
import {RoomCategoryStatsDO} from '../../../../room-categories/data-objects/RoomCategoryStatsDO';
import {NumberValidationRule} from '../../../../../utils/th-validation/rules/NumberValidationRule';

import _ = require("underscore");

export class PricePerPersonDO extends BaseDO implements IPriceProductPrice {
	adultsPriceList: PriceForFixedNumberOfPersonsDO[];
	childrenPriceList: PriceForFixedNumberOfPersonsDO[];
	firstChildWithoutAdultPrice: number;
	roomCategoryId: string;

	protected getPrimitivePropertyKeys(): string[] {
		return ["firstChildWithoutAdultPrice", "roomCategoryId"];
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
		try {
			var adultsPrice = 0;
			for (var noOfAdults = 1; noOfAdults <= query.noOfAdults; noOfAdults++) {
				adultsPrice += this.getPriceForNumberOfPersons(this.adultsPriceList, noOfAdults).price;
			}

			var childrenPrice = 0;
			for (var noOfChildren = 1; noOfChildren <= query.noOfChildren; noOfChildren++) {
				var priceForCurrentChild = this.getPriceForNumberOfPersons(this.childrenPriceList, noOfChildren).price;
				if (noOfChildren === 1 && query.noOfAdults === 0) {
					priceForCurrentChild = this.firstChildWithoutAdultPrice;
				}
				childrenPrice += priceForCurrentChild;
			}

			return adultsPrice + childrenPrice;
		} catch (e) {
			var thError = new ThError(ThStatusCode.PricePerPersonForSingleRoomCategoryDOInvalidPriceConfiguration, e);
			ThLogger.getInstance().logBusiness(ThLogLevel.Error, "Possible invalid price product configuration!", { query: query, priceConfig: this }, thError);
			return 0;
		}
	}
	private getPriceForNumberOfPersons(priceList: PriceForFixedNumberOfPersonsDO[], noOfPersons: number): PriceForFixedNumberOfPersonsDO {
		return _.find(priceList, (price: PriceForFixedNumberOfPersonsDO) => { return price.noOfPersons === noOfPersons });
	}

	public priceConfigurationIsValidFor(roomCategoryStatList: RoomCategoryStatsDO[]): boolean {
		var roomCategStat: RoomCategoryStatsDO = _.find(roomCategoryStatList, (stat: RoomCategoryStatsDO) => {
			return stat.roomCategory.id === this.roomCategoryId;
		});
		if (!roomCategStat) {
			return false;
		}
		var maxNoOfAdults: number = roomCategStat.capacity.totalCapacity.noAdults;
		if (!this.priceListIsValidForMaxNoOfPersons(this.adultsPriceList, maxNoOfAdults)) {
			return false;
		}

		if (!this.priceIsValid(this.firstChildWithoutAdultPrice)) {
			return false;
		}

		var maxNoOfChildren = roomCategStat.capacity.totalCapacity.noChildren;
		return this.priceListIsValidForMaxNoOfPersons(this.childrenPriceList, (maxNoOfChildren + maxNoOfAdults));
	}
	private priceListIsValidForMaxNoOfPersons(priceList: PriceForFixedNumberOfPersonsDO[], maxNoOfPersons: number): boolean {
		var thUtils = new ThUtils();
		for (var noOfPersons = 1; noOfPersons <= maxNoOfPersons; noOfPersons++) {
			var priceForFixedNumberOfPersons = this.getPriceForNumberOfPersons(priceList, noOfPersons);
			if (thUtils.isUndefinedOrNull(priceForFixedNumberOfPersons)) {
				return false;
			}
			if (!this.priceIsValid(priceForFixedNumberOfPersons.price)) {
				return false;
			}
		}
		return true;
	}
	private priceIsValid(price: number): boolean {
		var priceRule = NumberValidationRule.buildPriceNumberRule();
		return priceRule.validate(price).isValid();
	}
	public isConfiguredForRoomCategory(roomCategoryId: string): boolean {
		return this.roomCategoryId === roomCategoryId;
	}
}