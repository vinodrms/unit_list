import {Observable} from 'rxjs/Observable';
import {Observer} from "rxjs/Observer";
import {Injectable} from 'angular2/core';
import {Http, Response, URLSearchParams} from 'angular2/http';
import {IThHttp} from './IThHttp';
import {ThUtils} from '../ThUtils';
import {ThError} from '../responses/ThError';

enum ThStatusCode {
    Ok
}

@Injectable()
export class ThHttp implements IThHttp {
	private static BaseEndpointUrl = '/api/';

	private static HttpOk = 200;
	private static HttpForbidden = 403;

	private _thUtils: ThUtils;

	constructor(private _http: Http) {
	}

	public get(method: string, parameters: Object): Observable<Object> {
		var fullGetUrl = this.appendBaseUrl(method);
		var searchParams = this.buildUrlWithParameters(method, parameters);

		return Observable.create((observer: Observer<Object>) => {
			this._http.get(fullGetUrl, { search: searchParams }).subscribe((res: Response) => {
				this.parseResult(res, observer);
			}, (err: Error) => {
				observer.error(new ThError(err.message));
				observer.complete();
			});
		});
	}
	private buildUrlWithParameters(method: string, parameters: Object): URLSearchParams {
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
	private appendBaseUrl(method: String): string {
		return ThHttp.BaseEndpointUrl + method;
	}

	public post(method: string, parameters: Object): Observable<Object> {
		var url = this.appendBaseUrl(method);

		return Observable.create((observer: Observer<Object>) => {
			this._http.post(url, JSON.stringify(parameters)).subscribe((res: Response) => {
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
			// TODO : handle session timeout
		}
		else {
			observer.error(new ThError(result.statusText));
			observer.complete();
		}
	}
}