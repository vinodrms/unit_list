import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {AppContext, ThServerApi} from '../../../../common/utils/AppContext';
import {ARequestService} from '../common/ARequestService';
import {TotalCountDO} from '../common/data-objects/lazy-load/TotalCountDO';

@Injectable()
export class AddOnProductsTotalCountService extends ARequestService<TotalCountDO> {
	constructor(private _appContext: AppContext) {
		super();
	}
	protected sendRequest(): Observable<Object> {
		return this._appContext.thHttp.post(ThServerApi.AddOnProductsCount, {});
	}
	protected parseResult(result: Object): TotalCountDO {
		var countDO = new TotalCountDO();
		countDO.buildFromObject(result);
		return countDO;
	}
	public getTotalCountDO(): Observable<TotalCountDO> {
		return this.getServiceObservable();
	}
	public updateTotalCount() {
		this.updateServiceResult();
	}
}