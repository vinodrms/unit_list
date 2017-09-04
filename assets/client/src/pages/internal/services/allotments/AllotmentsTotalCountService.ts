import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppContext, ThServerApi } from '../../../../common/utils/AppContext';
import { ARequestService } from '../common/ARequestService';
import { TotalCountDO } from '../common/data-objects/lazy-load/TotalCountDO';
import { AllotmentStatus } from './data-objects/AllotmentDO';

@Injectable()
export class AllotmentsTotalCountService extends ARequestService<TotalCountDO> {
	private _allotmentStatus: AllotmentStatus;

	constructor(private _appContext: AppContext) {
		super();
	}
	protected sendRequest(): Observable<Object> {
		var searchCriteria = { status: this._allotmentStatus };
		return this._appContext.thHttp.post({
			serverApi: ThServerApi.AllotmentsCount,
			body: JSON.stringify({
				searchCriteria: searchCriteria
			})
		});
	}
	protected parseResult(result: Object): TotalCountDO {
		var countDO = new TotalCountDO();
		countDO.buildFromObject(result);
		return countDO;
	}
	public getTotalCountDO(allotmentStatus: AllotmentStatus): Observable<TotalCountDO> {
		this._allotmentStatus = allotmentStatus;
		return this.getServiceObservable();
	}
	public updateTotalCount() {
		this.updateServiceResult();
	}
}