import { ThError } from '../../../../utils/th-responses/ThError';
import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { IPriceProductItemActionStrategy } from '../IPriceProductItemActionStrategy';
import { PriceProductDO } from '../../../../data-layer/price-products/data-objects/PriceProductDO';
import { PriceProductMetaRepoDO, PriceProductItemMetaRepoDO } from '../../../../data-layer/price-products/repositories/IPriceProductRepository';
import { PriceProductItemUpdateActionFactory } from './PriceProductItemUpdateActionFactory';

export class PriceProductItemUpdateStrategy implements IPriceProductItemActionStrategy {
	constructor(private _appContext: AppContext, private _sessionContext: SessionContext,
		private _ppRepoMeta: PriceProductMetaRepoDO, private _priceProductDO: PriceProductDO) {
	}
	public save(resolve: { (result: PriceProductDO): void }, reject: { (err: ThError): void }) {
		var priceProductRepo = this._appContext.getRepositoryFactory().getPriceProductRepository();
		priceProductRepo.getPriceProductById(this._ppRepoMeta, this._priceProductDO.id)
			.then((loadedPriceProduct: PriceProductDO) => {
				var ppItemRepoMeta = this.buildPriceProductItemMetaRepoDO(loadedPriceProduct);
				var updateFactory = new PriceProductItemUpdateActionFactory(this._appContext, this._sessionContext, this._ppRepoMeta, ppItemRepoMeta);
				var updateStrategy = updateFactory.getActionStrategy(this._priceProductDO, loadedPriceProduct);
				updateStrategy.save(resolve, reject);
			}).catch((error: any) => {
				reject(error);
			});
	}

	private buildPriceProductItemMetaRepoDO(loadedPriceProductDO: PriceProductDO): PriceProductItemMetaRepoDO {
		return {
			id: loadedPriceProductDO.id,
			versionId: loadedPriceProductDO.versionId
		}
	}
}