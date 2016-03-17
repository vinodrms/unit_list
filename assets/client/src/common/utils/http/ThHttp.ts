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

	public get(method: string, parameters: Object): Promise<Object> {
		var fullGetUrl = this.appendBaseUrl(method);
		var searchParams = this.buildUrlWithParameters(method, parameters);
		return new Promise<Object>((resolve, reject) => {
			this._http.get(fullGetUrl, { search: searchParams }).subscribe((res: Response) => {
				this.parseResult(res, resolve, reject);
			}, (err: Error) => {
				reject(new ThError(err.message));
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

	public post(method: string, parameters: Object): Promise<Object> {
		var url = this.appendBaseUrl(method);
		return new Promise<Object>((resolve, reject) => {
			this._http.post(url, JSON.stringify(parameters)).subscribe((res: Response) => {
				this.parseResult(res, resolve, reject);
			}, (err: Error) => {
				reject(new ThError(err.message));
			});
		});
	}

	private parseResult(result: Response, resolve: (value: Object) => void, reject: (err: ThError) => void) {
		if (result.status == ThHttp.HttpOk) {
			var resultJson: Object = result.json();
			if (resultJson["statusCode"] == ThStatusCode.Ok) {
				resolve(resultJson["data"]);
				return;
			}
			reject(new ThError(resultJson["message"]));
		}
		else if (result.status == ThHttp.HttpForbidden) {
			// TODO : handle session timeout
		}
		else {
			reject(new ThError(result.statusText));
		}
	}
}