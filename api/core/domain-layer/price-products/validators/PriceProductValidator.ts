import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {ThUtils} from '../../../utils/ThUtils';
import {RoomCategoryDO} from '../../../data-layer/room-categories/data-objects/RoomCategoryDO';
import {RoomCategoryStatsDO} from '../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO';
import {PriceProductDO} from '../../../data-layer/price-products/data-objects/PriceProductDO';
import {TaxIdValidator} from '../../taxes/validators/TaxIdValidator';
import {AddOnProductIdValidator} from '../../add-on-products/validators/AddOnProductIdValidator';
import {RoomAggregator} from '../../rooms/aggregators/RoomAggregator';
import {YieldManagerFilterValidator} from '../../hotel-configurations/validators/YieldManagerFilterValidator';

import _ = require("underscore");

export class PriceProductValidator {
	private _thUtils: ThUtils;
	private _priceProduct: PriceProductDO;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
		this._thUtils = new ThUtils();
	}

	public validatePriceProduct(priceProduct: PriceProductDO): Promise<boolean> {
		this._priceProduct = priceProduct;
		return new Promise<boolean>((resolve: { (result: boolean): void }, reject: { (err: ThError): void }) => {
			this.validatePriceProductCore(resolve, reject);
		});
	}
	private validatePriceProductCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
		if (this._priceProduct.roomCategoryIdList.length == 0) {
			var thError = new ThError(ThStatusCode.PriceProductValidatorEmptyRoomCategoryList, null);
			ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Empty room category id list submitted on price product", this._priceProduct, thError);
			reject(thError);
			return;
		}

		var taxIdValidator = new TaxIdValidator(this._appContext, this._sessionContext);
		taxIdValidator.validateTaxIdList(this._priceProduct.taxIdList)
			.then((taxValidationResult: boolean) => {
				var addOnProductIdValidator = new AddOnProductIdValidator(this._appContext, this._sessionContext);
				return addOnProductIdValidator.validateAddOnProductIdList(this._priceProduct.addOnProductIdList);
			})
			.then((addOnProductValidationResult: boolean) => {
				var roomAggregator = new RoomAggregator(this._appContext);
				return roomAggregator.getUsedRoomCategoryList({ hotelId: this._sessionContext.sessionDO.hotel.id });
			})
			.then((usedRoomCategoryList: RoomCategoryDO[]) => {
				var validRoomCategoryIdList: string[] = this.getRoomCategoryIdList(usedRoomCategoryList);
				if (!this._thUtils.firstArrayIncludedInSecond(this._priceProduct.roomCategoryIdList, validRoomCategoryIdList)) {
					var thError = new ThError(ThStatusCode.PriceProductValidatorUnusedRoomCategoryId, null);
					ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invalid room category id list", this._priceProduct, thError);
					throw thError;
				}
				var roomAggregator = new RoomAggregator(this._appContext);
				return roomAggregator.getRoomCategoryStatsList({ hotelId: this._sessionContext.sessionDO.hotel.id }, this._priceProduct.roomCategoryIdList);
			})
			.then((roomCategoryStats: RoomCategoryStatsDO[]) => {
				if (!this._priceProduct.price.priceConfigurationIsValidFor(roomCategoryStats)) {
					var thError = new ThError(ThStatusCode.PriceProductValidatorInvalidPrices, null);
					ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invalid prices sent", this._priceProduct, thError);
					throw thError;
				}
				var ymFilterValidator = new YieldManagerFilterValidator(this._appContext, this._sessionContext);
				return ymFilterValidator.validateFilterList(this._priceProduct.yieldFilterList);
			})
			.then((filterCheckResult: boolean) => {
				resolve(true);
			}).catch((error: any) => {
				reject(error);
			});
	}
	private getRoomCategoryIdList(roomCategoryList: RoomCategoryDO[]): string[] {
		return _.map(roomCategoryList, (roomCategory: RoomCategoryDO) => {
			return roomCategory.id;
		});
	}
}