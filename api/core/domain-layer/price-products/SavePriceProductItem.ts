import { ThLogger, ThLogLevel } from '../../utils/logging/ThLogger';
import { ThError } from '../../utils/th-responses/ThError';
import { ThStatusCode } from '../../utils/th-responses/ThResponse';
import { AppContext } from '../../utils/AppContext';
import { SessionContext } from '../../utils/SessionContext';
import { ArrayValidationStructure } from '../../utils/th-validation/structure/ArrayValidationStructure';
import { ObjectValidationStructure } from '../../utils/th-validation/structure/ObjectValidationStructure';
import { SavePriceProductItemDO } from './SavePriceProductItemDO';
import { SavePriceProductItemPriceDO } from './validation-structures/SavePriceProductItemPriceDO';
import { SavePriceProductItemConstraintDO } from './validation-structures/SavePriceProductItemConstraintDO';
import { PriceProductDO } from '../../data-layer/price-products/data-objects/PriceProductDO';
import { ValidationResultParser } from '../common/ValidationResultParser';
import { PriceProductItemActionFactory } from './save-actions/PriceProductItemActionFactory';
import { IPriceProductItemActionStrategy } from './save-actions/IPriceProductItemActionStrategy';
import { PriceProductMetaRepoDO } from '../../data-layer/price-products/repositories/IPriceProductRepository';

export class SavePriceProductItem {
	private _inputDO: SavePriceProductItemDO;
	private _priceProductDO: PriceProductDO;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
	}

	public save(priceProductDO: SavePriceProductItemDO): Promise<PriceProductDO> {
		this._inputDO = priceProductDO;
		return new Promise<PriceProductDO>((resolve: { (result: PriceProductDO): void }, reject: { (err: ThError): void }) => {
			try {
				this.saveCore(resolve, reject);
			} catch (error) {
				var thError = new ThError(ThStatusCode.SavePriceProductItemError, error);
				ThLogger.getInstance().logError(ThLogLevel.Error, "error saving price product", this._inputDO, thError);
				reject(thError);
			}
		});
	}
	private saveCore(resolve: { (result: PriceProductDO): void }, reject: { (err: ThError): void }) {
		if (!this.submittedStructureIsValid(reject)) {
			return;
		}
		var ppRepoMeta = this.buildPriceProductMetaRepoDO();
		var actionFactory = new PriceProductItemActionFactory(this._appContext, this._sessionContext);
		var actionStrategy = actionFactory.getActionStrategy(ppRepoMeta, this._priceProductDO);
		actionStrategy.save(resolve, reject);
	}
	private submittedStructureIsValid(reject: { (err: ThError): void }): boolean {
		var validationResult = SavePriceProductItemDO.getValidationStructure().validateStructure(this._inputDO);
		if (!validationResult.isValid()) {
			var parser = new ValidationResultParser(validationResult, this._inputDO);
			parser.logAndReject("Error validating data for save price product", reject);
			return false;
		}

		if (this._inputDO.price.dynamicPriceList.length > SavePriceProductItemDO.MaxConstraintsForDiscount) {
			let thError = new ThError(ThStatusCode.SavePriceProductItemMaxNoDynamicRates, null);
			ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Submitted more than 15 dynamic rates", this._inputDO, thError);
			reject(thError);
			return false;
		}
		if (this._inputDO.price.dynamicPriceList.length == 0) {
			let thError = new ThError(ThStatusCode.SavePriceProductItemNoDynamicRates, null);
			ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Submitted 0 dynamic rates for a price product", this._inputDO, thError);
			reject(thError);
			return false;
		}

		for (var priceIndex = 0; priceIndex < this._inputDO.price.dynamicPriceList.length; priceIndex++) {
			let dynamicPrice = this._inputDO.price.dynamicPriceList[priceIndex];

			let priceValidationStruct = SavePriceProductItemPriceDO.getPriceListValidationStructure(this._inputDO.price);
			if (!priceValidationStruct.validateStructure(dynamicPrice.priceList).isValid()) {
				let thError = new ThError(ThStatusCode.SavePriceProductItemInvalidPrice, null);
				ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invalid submitted price for price product", this._inputDO, thError);
				reject(thError);
				return false;
			}
			let priceExceptionValidationStruct = SavePriceProductItemPriceDO.getPriceExceptionListValidationStructure(this._inputDO.price);
			if (!priceExceptionValidationStruct.validateStructure(dynamicPrice.priceExceptionList).isValid()) {
				let thError = new ThError(ThStatusCode.SavePriceProductItemInvalidPriceException, null);
				ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invalid submitted price exceptions for price product", this._inputDO, thError);
				reject(thError);
				return false;
			}
		}

		if (this._inputDO.constraints.constraintList.length > SavePriceProductItemDO.MaxConstraints) {
			var thError = new ThError(ThStatusCode.SavePriceProductItemTooManyConstraints, null);
			ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Submitted more than 20 constraints for the same price product", this._inputDO, thError);
			reject(thError);
			return false;
		}

		var validConstraints = true;
		this._inputDO.constraints.constraintList.forEach((constraintDO: SavePriceProductItemConstraintDO) => {
			var structure = SavePriceProductItemConstraintDO.getConstraintValidationStructure(constraintDO);
			if (!structure.validateStructure(constraintDO.constraint).isValid()) {
				validConstraints = false;
			}
		});
		if (!validConstraints) {
			var thError = new ThError(ThStatusCode.SavePriceProductItemInvalidConstraints, null);
			ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invalid submitted constraints for price product", this._inputDO, thError);
			reject(thError);
			return false;
		}

		if (this._inputDO.discounts.discountList.length > SavePriceProductItemDO.MaxDiscounts) {
			var thError = new ThError(ThStatusCode.SavePriceProductItemTooManyDiscounts, null);
			ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Submitted more than 20 discounts for the same price product", this._inputDO, thError);
			reject(thError);
			return false;
		}

		var maxNoConstraintsForSameDiscount = 0;
		this._inputDO.discounts.discountList.forEach(discount => { maxNoConstraintsForSameDiscount = Math.max(maxNoConstraintsForSameDiscount, discount.constraints.constraintList.length) });
		if (maxNoConstraintsForSameDiscount > SavePriceProductItemDO.MaxConstraintsForDiscount) {
			var thError = new ThError(ThStatusCode.SavePriceProductItemTooManyConstraintsForTheSameDiscount, null);
			ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Submitted more than 20 constraints for the same discount on a price product", this._inputDO, thError);
			reject(thError);
			return false;
		}

		var validDiscountConstraints = true;
		this._inputDO.discounts.discountList.forEach(discount => {
			discount.constraints.constraintList.forEach(constraintDO => {
				var structure = SavePriceProductItemConstraintDO.getConstraintValidationStructure(constraintDO);
				if (!structure.validateStructure(constraintDO.constraint).isValid()) {
					validDiscountConstraints = false;
				}
			});
		});
		if (!validDiscountConstraints) {
			var thError = new ThError(ThStatusCode.SavePriceProductItemInvalidDiscountConstraints, null);
			ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invalid submitted discount constraints for price product", this._inputDO, thError);
			reject(thError);
			return false;
		}

		this._priceProductDO = this.buildPriceProductDO();

		if (!this._priceProductDO.conditions.isValid()) {
			var thError = new ThError(ThStatusCode.SavePriceProductItemInvalidConditions, null);
			ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invalid submitted conditions for price product", this._inputDO, thError);
			reject(thError);
			return false;
		}

		return true;
	}
	private buildPriceProductDO(): PriceProductDO {
		var priceProduct = new PriceProductDO();
		priceProduct.buildFromObject(this._inputDO);
		priceProduct.hotelId = this._sessionContext.sessionDO.hotel.id;
		return priceProduct;
	}
	private buildPriceProductMetaRepoDO(): PriceProductMetaRepoDO {
		return {
			hotelId: this._sessionContext.sessionDO.hotel.id
		}
	}
}