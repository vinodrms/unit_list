import {AppContext} from '../../utils/AppContext';
import {SessionContext} from '../../utils/SessionContext';
import {PriceProductInputIdDO} from './validation-structures/PriceProductInputIdDO';
import {PriceProductDO, PriceProductStatus} from '../../data-layer/price-products/data-objects/PriceProductDO';
import {UpdatePriceProductItemStatus} from './utils/UpdatePriceProductItemStatus';

export class DeleteDraftPriceProductItem {
	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
	}

	public delete(inputDO: PriceProductInputIdDO): Promise<PriceProductDO> {
		var updatePPItemStatus = new UpdatePriceProductItemStatus(this._appContext, this._sessionContext);
		return updatePPItemStatus.updateStatus(inputDO, PriceProductStatus.Draft, PriceProductStatus.Deleted);
	}
}