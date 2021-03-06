import {ThLogger, ThLogLevel} from '../../utils/logging/ThLogger';
import {ThError} from '../../utils/th-responses/ThError';
import {ThStatusCode} from '../../utils/th-responses/ThResponse';
import {AppContext} from '../../utils/AppContext';
import {SessionContext} from '../../utils/SessionContext';
import {ThUtils} from '../../utils/ThUtils';
import {ValidationResultParser} from '../common/ValidationResultParser';
import {AddOnProductDO} from '../../data-layer/add-on-products/data-objects/AddOnProductDO';
import {AddOnProductCategoryDO} from '../../data-layer/common/data-objects/add-on-product/AddOnProductCategoryDO';
import {TaxIdValidator} from '../taxes/validators/TaxIdValidator';
import {AddOnProductItemActionFactory} from './save-actions/AddOnProductItemActionFactory';
import {SaveAddOnProductItemDO} from './SaveAddOnProductItemDO';

import _ = require("underscore");

export class SaveAddOnProductItem {
	private _thUtils: ThUtils;
	private _addOnProductDO: SaveAddOnProductItemDO;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
		this._thUtils = new ThUtils();
	}

	public save(addOnProductDO: SaveAddOnProductItemDO): Promise<AddOnProductDO> {
		this._addOnProductDO = addOnProductDO;
		return new Promise<AddOnProductDO>((resolve: { (result: AddOnProductDO): void }, reject: { (err: ThError): void }) => {
			try {
				this.saveCore(resolve, reject);
			} catch (error) {
				var thError = new ThError(ThStatusCode.SaveAddOnProductItemError, error);
				ThLogger.getInstance().logError(ThLogLevel.Error, "error saving add on product", this._addOnProductDO, thError);
				reject(thError);
			}
		});
	}
	private saveCore(resolve: { (result: AddOnProductDO): void }, reject: { (err: ThError): void }) {
		var validationResult = SaveAddOnProductItemDO.getValidationStructure().validateStructure(this._addOnProductDO);
		if (!validationResult.isValid()) {
			var parser = new ValidationResultParser(validationResult, this._addOnProductDO);
			parser.logAndReject("Error validating data for save add on product", reject);
			return;
		}
		var settingsRepository = this._appContext.getRepositoryFactory().getSettingsRepository();
		settingsRepository.getAddOnProductCategories({ id: this._addOnProductDO.categoryId })
			.then((addOnProductCategoryList: AddOnProductCategoryDO[]) => {
				if (!this.categoryIdIsValid(addOnProductCategoryList)) {
					var thError = new ThError(ThStatusCode.SaveAddOnProductItemInvalidCategoryId, null);
					ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invalid category id", this._addOnProductDO, thError);
					throw thError;
				}

				var taxIdValidator = new TaxIdValidator(this._appContext, this._sessionContext);
				return taxIdValidator.validateTaxIdList(this._addOnProductDO.taxIdList);
			})
			.then((taxValidationResult: boolean) => {
				return this.saveAddOnProduct();
			})
			.then((savedAddOnProduct: AddOnProductDO) => {
				resolve(savedAddOnProduct);
			}).catch((error: any) => {
				var thError = new ThError(ThStatusCode.SaveAddOnProductItemError, error);
				if (thError.isNativeError()) {
					ThLogger.getInstance().logError(ThLogLevel.Error, "error saving add on product item", this._addOnProductDO, thError);
				}
				reject(thError);
			});
	}

	private categoryIdIsValid(addOnProductCategoryList: AddOnProductCategoryDO[]) {
		var foundAddOnProductCategory = _.find(addOnProductCategoryList, (category: AddOnProductCategoryDO) => { return category.id === this._addOnProductDO.categoryId });
		return !this._thUtils.isUndefinedOrNull(foundAddOnProductCategory);
	}

	private saveAddOnProduct(): Promise<AddOnProductDO> {
		return new Promise<AddOnProductDO>((resolve: { (result: AddOnProductDO): void }, reject: { (err: ThError): void }) => {
			this.saveAddOnProductCore(resolve, reject);
		});
	}
	private saveAddOnProductCore(resolve: { (result: AddOnProductDO): void }, reject: { (err: ThError): void }) {
		var actionFactory = new AddOnProductItemActionFactory(this._appContext, this._sessionContext);
		var actionStrategy = actionFactory.getActionStrategy(this.buildAddOnProductDO());
		actionStrategy.save(resolve, reject);
	}
	private buildAddOnProductDO(): AddOnProductDO {
		var aop = new AddOnProductDO();
		aop.buildFromObject(this._addOnProductDO);
		aop.hotelId = this._sessionContext.sessionDO.hotel.id;
		aop.price = this._thUtils.roundNumberToTwoDecimals(aop.price);
		aop.internalCost = this._thUtils.roundNumberToTwoDecimals(aop.internalCost);
		return aop;
	}
}