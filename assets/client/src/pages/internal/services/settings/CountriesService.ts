import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AppContext, ThServerApi} from '../../../../common/utils/AppContext';
import {ARequestService} from '../common/ARequestService';
import {CountriesDO} from './data-objects/CountriesDO';

@Injectable()
export class CountriesService extends ARequestService<CountriesDO> {
	constructor(private _appContext: AppContext) {
		super();
	}
	protected sendRequest(): Observable<Object> {
		return this._appContext.thHttp.get(ThServerApi.SettingsCountries);
	}
	protected parseResult(result: Object): CountriesDO {
		var hotelcountriesDO: CountriesDO = new CountriesDO();
		hotelcountriesDO.buildFromObject(result);
		return hotelcountriesDO;
	}
	public getCountriesDO(): Observable<CountriesDO> {
		return this.getServiceObservable();
	}
}