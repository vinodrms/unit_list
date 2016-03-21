import {Observable} from 'rxjs/Observable';
import {Observer} from "rxjs/Observer";
import {Injectable, Inject} from 'angular2/core';
import {Http, Response, URLSearchParams} from 'angular2/http';
import {IThHttp} from './IThHttp';
import {IBrowserLocation} from '../browser-location/IBrowserLocation';
import {LoginStatusCode} from '../responses/LoginStatusCode';
import {ThUtils} from '../ThUtils';
import {ThError} from '../responses/ThError';
import {ThTranslation} from '../localization/ThTranslation';
import {ThServerApi, ServerApiBuilder} from './ThServerApi';

enum ThStatusCode {
    Ok
}

@Injectable()
export class ThHttp implements IThHttp {
	private static HttpOk = 200;
	private static HttpForbidden = 403;

	private _thUtils: ThUtils;

	constructor(
		private _http: Http,
		private _thTranslation: ThTranslation,
		@Inject(IBrowserLocation) private _browserLocation: IBrowserLocation) {
	}
	
	private getApiUrl(serverApi: ThServerApi): string {
		var builder = new ServerApiBuilder(serverApi);
		return builder.getUrl();
	}

	public get(serverApi: ThServerApi, parameters: Object): Observable<Object> {
		var url = this.getApiUrl(serverApi);
		var searchParams = this.buildSearchParameters(parameters);

		return Observable.create((observer: Observer<Object>) => {
			this._http.get(url, { search: searchParams, body: JSON.stringify(this.getDefaultReqParams()) }).subscribe((res: Response) => {
				this.parseResult(res, observer);
			}, (err: Error) => {
				observer.error(new ThError(err.message));
				observer.complete();
			});
		});
	}
	private getDefaultReqParams(): Object {
		return {
			thLocale: this._thTranslation.locale
		}
	}
	private buildSearchParameters(parameters: Object): URLSearchParams {
		let urlSearchParams: URLSearchParams = new URLSearchParams();
		if (this._thUtils.isUndefinedOrNull(parameters)) {
			return urlSearchParams;
		}
		var keys = Object.keys(parameters);
		keys.forEach(key => {
			urlSearchParams.set(key, parameters[key]);
		});
		return urlSearchParams;
	}

	public post(serverApi: ThServerApi, parameters: Object): Observable<Object> {
		var url = this.getApiUrl(serverApi);
		var actualParams = this.getDefaultReqParams();
		if (_.isObject(parameters)) {
			actualParams = _.extend(actualParams, parameters);
		}
		return Observable.create((observer: Observer<Object>) => {
			this._http.post(url, JSON.stringify(actualParams)).subscribe((res: Response) => {
				this.parseResult(res, observer);
			}, (err: Error) => {
				observer.error(new ThError(err.message));
				observer.complete();
			});
		});
	}

	private parseResult(result: Response, observer: Observer<Object>) {
		if (result.status == ThHttp.HttpOk) {
			var resultJson: Object = result.json();
			if (resultJson["statusCode"] == ThStatusCode.Ok) {
				observer.next(resultJson["data"]);
				observer.complete();
				return;
			}
			observer.error(new ThError(resultJson["message"]));
			observer.complete();
		}
		else if (result.status == ThHttp.HttpForbidden) {
			this._browserLocation.goToLoginPage(LoginStatusCode.SessionTimeout);
		}
		else {
			observer.error(new ThError(result.statusText));
			observer.complete();
		}
	}
}