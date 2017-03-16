import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { PriceProductDO, PriceProductStatus } from '../../../../data-layer/price-products/data-objects/PriceProductDO';
import { PriceProductMetaRepoDO, PriceProductItemMetaRepoDO } from '../../../../data-layer/price-products/repositories/IPriceProductRepository';
import { IPriceProductItemActionStrategy } from '../IPriceProductItemActionStrategy';
import { ActiveStateUpdateStrategy } from './strategies/ActiveStateUpdateStrategy';
import { DraftStateUpdateStrategy } from './strategies/DraftStateUpdateStrategy';
import { InvalidStateUpdateStrategy } from './strategies/InvalidStateUpdateStrategy';

export class PriceProductItemUpdateActionFactory {
	constructor(private _appContext: AppContext, private _sessionContext: SessionContext,
		private _ppRepoMeta: PriceProductMetaRepoDO, private _ppItemRepoMeta: PriceProductItemMetaRepoDO) {
	}

	public getActionStrategy(inputPriceProductDO: PriceProductDO, loadedPriceProductDO: PriceProductDO): IPriceProductItemActionStrategy {
		switch (loadedPriceProductDO.status) {
			case PriceProductStatus.Active:
				return new ActiveStateUpdateStrategy(this._appContext, this._sessionContext, this._ppRepoMeta, this._ppItemRepoMeta, inputPriceProductDO, loadedPriceProductDO);
			case PriceProductStatus.Draft:
				return new DraftStateUpdateStrategy(this._appContext, this._sessionContext, this._ppRepoMeta, this._ppItemRepoMeta, inputPriceProductDO);
			default:
				return new InvalidStateUpdateStrategy(this._appContext, this._sessionContext, this._ppRepoMeta, this._ppItemRepoMeta, inputPriceProductDO);
		}
	}
}