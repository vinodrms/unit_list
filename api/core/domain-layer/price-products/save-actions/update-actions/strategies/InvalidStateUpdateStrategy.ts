import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../../utils/AppContext';
import {SessionContext} from '../../../../../utils/SessionContext';
import {PriceProductDO} from '../../../../../data-layer/price-products/data-objects/PriceProductDO';
import {PriceProductMetaRepoDO, PriceProductItemMetaRepoDO} from '../../../../../data-layer/price-products/repositories/IPriceProductRepository';
import {IPriceProductItemActionStrategy} from '../../IPriceProductItemActionStrategy';

export class InvalidStateUpdateStrategy implements IPriceProductItemActionStrategy {
	constructor(private _appContext: AppContext, private _sessionContext: SessionContext,
		private _ppRepoMeta: PriceProductMetaRepoDO, private _ppItemRepoMeta: PriceProductItemMetaRepoDO,
		private _priceProductDO: PriceProductDO) {
	}

	public save(resolve: { (result: PriceProductDO): void }, reject: { (err: ThError): void }) {
		var thError = new ThError(ThStatusCode.PriceProductItemUpdateStrategyOnlyActiveAndDraftCanBeUpdated, null);
		ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invalid price product state for update", this._priceProductDO, thError);
		reject(thError);
	}
}