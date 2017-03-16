import { ThLogger, ThLogLevel } from '../../../../../utils/logging/ThLogger';
import { ThError } from '../../../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../../../utils/th-responses/ThResponse';
import { AppContext } from '../../../../../utils/AppContext';
import { SessionContext } from '../../../../../utils/SessionContext';
import { PriceProductDO } from '../../../../../data-layer/price-products/data-objects/PriceProductDO';
import { PriceProductMetaRepoDO, PriceProductItemMetaRepoDO } from '../../../../../data-layer/price-products/repositories/IPriceProductRepository';
import { IPriceProductItemActionStrategy } from '../../IPriceProductItemActionStrategy';
import { YieldManagerFilterValidator } from '../../../../hotel-configurations/validators/YieldManagerFilterValidator';

export class ActiveStateUpdateStrategy implements IPriceProductItemActionStrategy {
	constructor(private _appContext: AppContext, private _sessionContext: SessionContext,
		private _ppRepoMeta: PriceProductMetaRepoDO, private _ppItemRepoMeta: PriceProductItemMetaRepoDO,
		private _priceProductDO: PriceProductDO,
		private _loadedPriceProductDO: PriceProductDO) {
	}

	public save(resolve: { (result: PriceProductDO): void }, reject: { (err: ThError): void }) {
		var ymFilterValidator = new YieldManagerFilterValidator(this._appContext, this._sessionContext);
		ymFilterValidator.validateFilterList(this._priceProductDO.yieldFilterList)
			.then((filterCheckResult: boolean) => {
				var priceProductRepo = this._appContext.getRepositoryFactory().getPriceProductRepository();
				return priceProductRepo.updatePriceProductYieldFiltersAndNotes(this._ppRepoMeta, this._ppItemRepoMeta, this._priceProductDO.yieldFilterList, this._priceProductDO.notes);
			})
			.then((updatedPriceProduct: PriceProductDO) => {
				resolve(updatedPriceProduct);
			}).catch((error: any) => {
				reject(error);
			});
	}
	// TODO: for all the dynamic prices from _loadedPriceProductDO, we need to update their names & description
	// for the onces that do not exist (are new) => add them to the dynamic price list
	// users should be able to add new dynamic prices even for active price products
}