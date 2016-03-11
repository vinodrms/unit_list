import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {ThUtils} from '../../../utils/ThUtils';
import {PriceProductDO} from '../../../data-layer/price-products/data-objects/PriceProductDO';
import {PriceProductMetaRepoDO} from '../../../data-layer/price-products/repositories/IPriceProductRepository';
import {IPriceProductItemActionStrategy} from './IPriceProductItemActionStrategy';
import {PriceProductItemAddStrategy} from './add-action/PriceProductItemAddStrategy';
import {PriceProductItemUpdateStrategy} from './update-actions/PriceProductItemUpdateStrategy';

export class PriceProductItemActionFactory {
	private _thUtils: ThUtils;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
		this._thUtils = new ThUtils();
	}

	public getActionStrategy(ppRepoMeta: PriceProductMetaRepoDO, priceProductDO: PriceProductDO): IPriceProductItemActionStrategy {
		if (this._thUtils.isUndefinedOrNull(priceProductDO.id)) {
			return new PriceProductItemAddStrategy(this._appContext, this._sessionContext, ppRepoMeta, priceProductDO);
		}
		return new PriceProductItemUpdateStrategy(this._appContext, this._sessionContext, ppRepoMeta, priceProductDO);
	}
}