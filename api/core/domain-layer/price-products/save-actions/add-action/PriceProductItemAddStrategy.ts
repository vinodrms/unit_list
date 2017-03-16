import { ThLogger, ThLogLevel } from '../../../../utils/logging/ThLogger';
import { ThError } from '../../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../../utils/th-responses/ThResponse';
import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { PriceProductDO, PriceProductStatus } from '../../../../data-layer/price-products/data-objects/PriceProductDO';
import { PriceProductMetaRepoDO } from '../../../../data-layer/price-products/repositories/IPriceProductRepository';
import { IPriceProductItemActionStrategy } from '../IPriceProductItemActionStrategy';
import { PriceProductValidator } from '../../validators/PriceProductValidator';
import { PriceProductActionUtils } from '../utils/PriceProductActionUtils';
import { AddOnProductIdValidator } from '../../../add-on-products/validators/AddOnProductIdValidator';
import { AddOnProductsContainer } from '../../../add-on-products/validators/results/AddOnProductsContainer';

export class PriceProductItemAddStrategy implements IPriceProductItemActionStrategy {
	private _priceProductUtils: PriceProductActionUtils;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext,
		private _ppRepoMeta: PriceProductMetaRepoDO, private _priceProductDO: PriceProductDO) {
		this._priceProductUtils = new PriceProductActionUtils();
	}

	public save(resolve: { (result: PriceProductDO): void }, reject: { (err: ThError): void }) {
		if (this._priceProductDO.status !== PriceProductStatus.Active && this._priceProductDO.status !== PriceProductStatus.Draft) {
			var thError = new ThError(ThStatusCode.PriceProductItemStrategyInvalidStatus, null);
			ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Price product can only be added as draft or active", this._priceProductDO, thError);
			reject(thError);
			return;
		}

		var addOnProductIdValidator = new AddOnProductIdValidator(this._appContext, this._sessionContext);
		addOnProductIdValidator.validateAddOnProductIdList(this._priceProductDO.includedItems.getUniqueAddOnProductIdList())
			.then((aopContainer: AddOnProductsContainer) => {
				this._priceProductUtils.updateIncludedItems(this._priceProductDO, aopContainer);

				var ppValidator = new PriceProductValidator(this._appContext, this._sessionContext);
				return ppValidator.validatePriceProduct(this._priceProductDO);
			}).then((result: boolean) => {
				var ppUtils = new PriceProductActionUtils();
				ppUtils.populateDefaultValuesOn(this._priceProductDO);
				ppUtils.populateDynamicPriceIdsOn(this._priceProductDO);
				var ppRepo = this._appContext.getRepositoryFactory().getPriceProductRepository();
				return ppRepo.addPriceProduct(this._ppRepoMeta, this._priceProductDO);
			})
			.then((addedPriceProduct: PriceProductDO) => {
				resolve(addedPriceProduct);
			}).catch((error: any) => {
				reject(error);
			});
	}
}