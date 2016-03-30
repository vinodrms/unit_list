import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {AppContext, ThServerApi} from '../../../../common/utils/AppContext';
import {ARequestService} from '../common/ARequestService';
import {TaxContainerDO} from './data-objects/TaxContainerDO';

@Injectable()
export class TaxService extends ARequestService<TaxContainerDO> {
	constructor(private _appContext: AppContext) {
		super();
	}
	protected sendRequest(): Observable<Object> {
		return this._appContext.thHttp.get(ThServerApi.Taxes);
	}
	protected parseResult(result: Object): TaxContainerDO {
		var taxContainerDO: TaxContainerDO = new TaxContainerDO();
		taxContainerDO.buildFromObject(result["taxes"]);
		return taxContainerDO;
	}
	public getTaxContainerDO(): Observable<TaxContainerDO> {
		return this.getServiceObservable();
	}
}