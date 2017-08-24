import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppContext, ThServerApi } from '../../../../common/utils/AppContext';
import { ARequestService } from '../common/ARequestService';
import { TotalCountDO } from '../common/data-objects/lazy-load/TotalCountDO';
import { PriceProductStatus } from './data-objects/PriceProductDO';

@Injectable()
export class PriceProductsTotalCountService extends ARequestService<TotalCountDO> {
	private _priceProductStatus: PriceProductStatus;

	constructor(private _appContext: AppContext) {
		super();
	}
	protected sendRequest(): Observable<Object> {
		var searchCriteria = { status: this._priceProductStatus };
		return this._appContext.thHttp.post({
			serverApi: ThServerApi.PriceProductsCount,
			parameters: {
				searchCriteria: searchCriteria
			}
		});
	}
	protected parseResult(result: Object): TotalCountDO {
		var countDO = new TotalCountDO();
		countDO.buildFromObject(result);
		return countDO;
	}
	public getTotalCountDO(priceProductStatus: PriceProductStatus): Observable<TotalCountDO> {
		this._priceProductStatus = priceProductStatus;
		return this.getServiceObservable();
	}
	public updateTotalCount() {
		this.updateServiceResult();
	}
}