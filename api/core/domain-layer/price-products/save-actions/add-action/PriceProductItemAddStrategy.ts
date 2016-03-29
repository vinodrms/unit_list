import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {PriceProductDO, PriceProductStatus} from '../../../../data-layer/price-products/data-objects/PriceProductDO';
import {PriceProductMetaRepoDO} from '../../../../data-layer/price-products/repositories/IPriceProductRepository';
import {IPriceProductItemActionStrategy} from '../IPriceProductItemActionStrategy';
import {PriceProductValidator} from '../../validators/PriceProductValidator';
import {PriceProductActionUtils} from '../utils/PriceProductActionUtils';

export class PriceProductItemAddStrategy implements IPriceProductItemActionStrategy {
	constructor(private _appContext: AppContext, private _sessionContext: SessionContext,
		private _ppRepoMeta: PriceProductMetaRepoDO, private _priceProductDO: PriceProductDO) {
	}

	public save(resolve: { (result: PriceProductDO): void }, reject: { (err: ThError): void }) {
		if (this._priceProductDO.status !== PriceProductStatus.Active && this._priceProductDO.status !== PriceProductStatus.Draft) {
			var thError = new ThError(ThStatusCode.PriceProductItemStrategyInvalidStatus, null);
			ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Price product can only be added as draft or active", this._priceProductDO, thError);
			reject(thError);
			return;
		}

		var ppValidator = new PriceProductValidator(this._appContext, this._sessionContext);
		ppValidator.validatePriceProduct(this._priceProductDO)
			.then((result: boolean) => {
				var ppUtils = new PriceProductActionUtils();
				ppUtils.populateDefaultIntervalsOn(this._priceProductDO);
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