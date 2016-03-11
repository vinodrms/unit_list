import {ThLogger, ThLogLevel} from '../../utils/logging/ThLogger';
import {ThError} from '../../utils/th-responses/ThError';
import {ThStatusCode} from '../../utils/th-responses/ThResponse';
import {AppContext} from '../../utils/AppContext';
import {SessionContext} from '../../utils/SessionContext';
import {SavePriceProductItemDO} from './SavePriceProductItemDO';
import {SavePriceProductItemPriceDO} from './validation-structures/SavePriceProductItemPriceDO';
import {SavePriceProductItemConstraintDO} from './validation-structures/SavePriceProductItemConstraintDO';
import {PriceProductDO} from '../../data-layer/price-products/data-objects/PriceProductDO';
import {ValidationResultParser} from '../common/ValidationResultParser';
import {PriceProductItemActionFactory} from './save-actions/PriceProductItemActionFactory';
import {IPriceProductItemActionStrategy} from './save-actions/IPriceProductItemActionStrategy';
import {PriceProductMetaRepoDO} from '../../data-layer/price-products/repositories/IPriceProductRepository';

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

		var priceValidationResult = SavePriceProductItemPriceDO.getPriceConfigurationValidationStructure(this._inputDO.price);
		if (!priceValidationResult.validateStructure(this._inputDO.price.priceConfiguration).isValid()) {
			var thError = new ThError(ThStatusCode.SavePriceProductItemInvalidPrice, null);
			ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invalid submitted price for price product", this._inputDO, thError);
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