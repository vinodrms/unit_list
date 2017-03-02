import { BaseDO } from '../../../common/base/BaseDO';
import { ThUtils } from '../../../../utils/ThUtils';
import { PriceProductPriceType, PriceProductPriceQueryDO, IPriceProductPrice } from './IPriceProductPrice';
import { SinglePriceDO } from './single-price/SinglePriceDO';
import { PricePerPersonDO } from './price-per-person/PricePerPersonDO';
import { RoomCategoryStatsDO } from '../../../room-categories/data-objects/RoomCategoryStatsDO';
import { PriceExceptionDO } from './price-exceptions/PriceExceptionDO';
import { ThDateDO } from '../../../../utils/th-dates/data-objects/ThDateDO';
import { ISOWeekDay } from '../../../../utils/th-dates/data-objects/ISOWeekDay';

import _ = require('underscore');

export class PriceProductPriceDO extends BaseDO {
	type: PriceProductPriceType;
	priceList: IPriceProductPrice[];
	priceExceptionList: PriceExceptionDO[];

	protected getPrimitivePropertyKeys(): string[] {
		return ["type"];
	}

	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.priceList = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "priceList"), (priceObject: Object) => {
			var price: IPriceProductPrice = this.buildPriceInstance(this.type);
			price.buildFromObject(priceObject);
			this.priceList.push(price);
		});

		this.priceExceptionList = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "priceExceptionList"), (priceExceptionObject: Object) => {
			let priceException = new PriceExceptionDO();
			priceException.buildFromObject(priceExceptionObject);
			priceException.price = this.buildPriceInstance(this.type);
			priceException.price.buildFromObject(this.getObjectPropertyEnsureUndefined(priceExceptionObject, "price"));
			this.priceExceptionList.push(priceException);
		});
	}
	private buildPriceInstance(type: PriceProductPriceType): IPriceProductPrice {
		if (type === PriceProductPriceType.SinglePrice) {
			return new SinglePriceDO();
		}
		return new PricePerPersonDO();
	}

	public hasPriceConfiguredFor(query: PriceProductPriceQueryDO): boolean {
		var priceItem: IPriceProductPrice = this.getPriceForRoomCategory(query.roomCategoryId);
		if (!priceItem) {
			return false;
		}
		return priceItem.hasPriceConfiguredFor(query);
	}
	public getPricePerNightBreakdownFor(query: PriceProductPriceQueryDO): number[] {
		var priceBreakdown: number[] = [];

		let priceItem: IPriceProductPrice = this.getPriceForRoomCategory(query.roomCategoryId);
		let defaultPrice = priceItem.getPricePerNightFor(query);

		var thUtils = new ThUtils();
		_.forEach(query.bookingInterval.bookingDateList, (bookingDate: ThDateDO) => {
			let exception = this.getPriceException(query.roomCategoryId, bookingDate.getISOWeekDay());
			if (!thUtils.isUndefinedOrNull(exception)) {
				let exceptionPrice = exception.price.getPricePerNightFor(query);
				priceBreakdown.push(exceptionPrice);
			}
			else {
				priceBreakdown.push(defaultPrice);
			}
		});
		return priceBreakdown;
	}
	private getPriceForRoomCategory(roomCategoryId: string): IPriceProductPrice {
		return _.find(this.priceList, (price: IPriceProductPrice) => { return price.getRoomCategoryId() === roomCategoryId; });
	}
	private getPriceException(roomCategoryId: string, dayOfWeek: ISOWeekDay): PriceExceptionDO {
		return _.find(this.priceExceptionList, priceException => {
			return priceException.getRoomCategoryId() === roomCategoryId &&
				priceException.dayFromWeek === dayOfWeek;
		});
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
		var priceItem: IPriceProductPrice = this.getPriceForRoomCategory(roomCategoryId);
		if (thUtils.isUndefinedOrNull(priceItem)) {
			return false;
		}
		return priceItem.priceConfigurationIsValidFor(roomCategoryStatList);
	}

	public isConfiguredForRoomCategory(roomCategoryId: string): boolean {
		var thUtils = new ThUtils();
		var priceItem: IPriceProductPrice = this.getPriceForRoomCategory(roomCategoryId);
		return !thUtils.isUndefinedOrNull(priceItem);
	}

	public roundPricesToTwoDecimals() {
		_.forEach(this.priceList, (price: IPriceProductPrice) => {
			price.roundPricesToTwoDecimals();
		});
	}
}