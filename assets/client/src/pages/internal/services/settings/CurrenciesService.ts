import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {AppContext, ThServerApi} from '../../../../common/utils/AppContext';
import {ARequestService} from '../common/ARequestService';
import {CurrenciesDO} from './data-objects/CurrenciesDO';

@Injectable()
export class CurrenciesService extends ARequestService<CurrenciesDO> {
	constructor(private _appContext: AppContext) {
		super();
	}
	protected sendRequest(): Observable<Object> {
		return this._appContext.thHttp.get(ThServerApi.SettingsCurrencies);
	}
	protected parseResult(result: Object): CurrenciesDO {
		var currenciesDO: CurrenciesDO = new CurrenciesDO();
		currenciesDO.buildFromObject(result);
		return currenciesDO;
	}
	public getCurrenciesDO(): Observable<CurrenciesDO> {
		return this.getServiceObservable();
	}
}