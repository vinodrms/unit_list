import { Observable } from 'rxjs/Observable';
import { Observer } from "rxjs/Observer";
import { Injectable, Inject } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { IThHttp, UploadedFileResponse } from './IThHttp';
import { IBrowserLocation } from '../browser-location/IBrowserLocation';
import { LoginStatusCode } from '../responses/LoginStatusCode';
import { ThUtils } from '../ThUtils';
import { ThError } from '../responses/ThError';
import { ThTranslation } from '../localization/ThTranslation';
import { ThServerApi, ServerApiBuilder } from './ThServerApi';

import * as _ from "underscore";

enum ThStatusCode {
	Ok
}

@Injectable()
export class ThHttp implements IThHttp {
	private static HttpOk = 200;
	private static HttpForbidden = 403;
	private static MaxFileSizeBytes: number = 16 * 1024 * 1024;

	private _thUtils: ThUtils;

	constructor(
		private _http: Http,
		private _thTranslation: ThTranslation,
		@Inject(IBrowserLocation) private _browserLocation: IBrowserLocation) {
		this._thUtils = new ThUtils();
	}

	private getApiUrl(serverApi: ThServerApi): string {
		var builder = new ServerApiBuilder(serverApi);
		return builder.getUrl();
	}

	public get(serverApi: ThServerApi, parameters?: Object): Observable<Object> {
		var url = this.getApiUrl(serverApi);
		var searchParams = this.buildSearchParameters(parameters);

		return new Observable<Object>((observer: Observer<Object>) => {
			this._http.get(url, { search: searchParams, body: JSON.stringify(this.getDefaultReqParams()) }).subscribe((res: Response) => {
				this.parseResult(res, observer);
			}, (err: any) => {
				this.parseError(err, observer);
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
		return new Observable((observer: Observer<Object>) => {
			this._http.post(url, JSON.stringify(actualParams)).subscribe((res: Response) => {
				this.parseResult(res, observer);
			}, (err: any) => {
				this.parseError(err, observer);
			});
		});
	}

	public uploadFile(file: File): Observable<UploadedFileResponse> {
		let url = this.getApiUrl(ThServerApi.ServiceUploadFile);
		return new Observable<UploadedFileResponse>((observer: Observer<UploadedFileResponse>) => {
			if (file.size > ThHttp.MaxFileSizeBytes) {
				var thError = new ThError(this._thTranslation.translate("The maximum file size is 16MB"));
				observer.error(thError);
				observer.complete();
				return;
			}
			let formData: FormData = new FormData();
			let xhr: XMLHttpRequest = new XMLHttpRequest();

			formData.append("file", file, file.name);

			xhr.onreadystatechange = () => {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						var resultJson = JSON.parse(xhr.response);
						this.parseJsonResult(resultJson, observer);
					} else {
						observer.error(xhr.response);
					}
				}
			};
			xhr.open('POST', url, true);
			xhr.send(formData);
		});
	}
	private parseError(error: any, observer: Observer<Object>) {
		if (error.status == ThHttp.HttpForbidden) {
			this._browserLocation.goToLoginPage(LoginStatusCode.SessionTimeout);
			return;
		}
		observer.error(new ThError(error.message));
		observer.complete();
	}

	private parseResult(result: Response, observer: Observer<Object>) {
		if (result.status == ThHttp.HttpOk) {
			var resultJson: Object = result.json();
			this.parseJsonResult(resultJson, observer);
		}
		else if (result.status == ThHttp.HttpForbidden) {
			this._browserLocation.goToLoginPage(LoginStatusCode.SessionTimeout);
		}
		else {
			observer.error(new ThError(result.statusText));
			observer.complete();
		}
	}
	private parseJsonResult(resultJson: Object, observer: Observer<Object>) {
		if (resultJson["statusCode"] == ThStatusCode.Ok) {
			observer.next(resultJson["data"]);
			observer.complete();
			return;
		}
		observer.error(new ThError(resultJson["message"]));
		observer.complete();
	}
}