import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../../utils/AppContext';
import {SessionContext} from '../../../../../utils/SessionContext';
import {PriceProductDO} from '../../../../../data-layer/price-products/data-objects/PriceProductDO';
import {PriceProductMetaRepoDO, PriceProductItemMetaRepoDO} from '../../../../../data-layer/price-products/repositories/IPriceProductRepository';
import {IPriceProductItemActionStrategy} from '../../IPriceProductItemActionStrategy';

export class ActiveStateUpdateStrategy implements IPriceProductItemActionStrategy {
	constructor(private _appContext: AppContext, private _sessionContext: SessionContext,
		private _ppRepoMeta: PriceProductMetaRepoDO, private _ppItemRepoMeta: PriceProductItemMetaRepoDO,
		private _priceProductDO: PriceProductDO) {
	}

	public save(resolve: { (result: PriceProductDO): void }, reject: { (err: ThError): void }) {
		var priceProductRepo = this._appContext.getRepositoryFactory().getPriceProductRepository();
		priceProductRepo.updatePriceProductYieldFilters(this._ppRepoMeta, this._ppItemRepoMeta, this._priceProductDO.yieldFilterList)
			.then((updatedPriceProduct: PriceProductDO) => {
				resolve(updatedPriceProduct);
			}).catch((error: any) => {
				reject(error);
			});
	}
}