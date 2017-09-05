import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";
import { Injectable, Inject } from '@angular/core';
import { Http, Response, URLSearchParams, Headers, RequestOptions } from '@angular/http';

import { IThHttp, UploadedFileResponse, RequestConfiguration } from '../IThHttp';
import { IBrowserLocation } from '../../browser-location/IBrowserLocation';
import { LoginStatusCode } from '../../responses/LoginStatusCode';
import { ThUtils } from '../../ThUtils';
import { ThError } from '../../responses/ThError';
import { ThTranslation } from '../../localization/ThTranslation';
import { ThServerApi, ServerApiBuilder } from '../ThServerApi';
import { ThOAuthHttpHelper, RequestStrategyFunc } from "./ThOAuthHttpHelper";
import { TokenDO } from "../../oauth-token/TokenDO";
import { ITokenService } from "../../oauth-token/ITokenService";
import { HttpStatusCode } from "../HttpStatusCode";

import * as _ from "underscore";

@Injectable()
export class ThOAuthHttp implements IThHttp {
	private static MaxFileSizeBytes: number = 16 * 1024 * 1024;

	private helper: ThOAuthHttpHelper;
	private refreshTokenObservable: Observable<TokenDO>;
	private thUtils: ThUtils;

	constructor(
		@Inject(IBrowserLocation) private browserLocation: IBrowserLocation,
		@Inject(ITokenService) private tokenService: ITokenService,
		private http: Http,
		private thTranslation: ThTranslation) {
			
		this.thUtils = new ThUtils();
		this.helper = new ThOAuthHttpHelper(browserLocation, tokenService, http);
	}

	public get(config: RequestConfiguration): Observable<Object> {
		let getReqStrategy: RequestStrategyFunc = (baseUrl, queryParameters, headers, body) => {
			let searchParams = this.helper.buildSearchParameters(queryParameters);

			let options = new RequestOptions();
			options.headers = headers;
			options.params = searchParams;
			
			return this.http.get(baseUrl, options);
        };

		return this.runRequestWithRetry(config, getReqStrategy);
	}

	public post(config: RequestConfiguration): Observable<Object> {

		let postReqStrategy: RequestStrategyFunc = (baseUrl, queryParameters: Object, headers, body) => {
			try {
				let bodyWithDefaultParams = {};

				let bodyObject = JSON.parse(body);
				Object.keys(bodyObject).forEach((key) => bodyWithDefaultParams[key] = bodyObject[key]);

				let defaultParamsObject = this.getDefaultReqParams();
				Object.keys(defaultParamsObject).forEach((key) => bodyWithDefaultParams[key] = defaultParamsObject[key]);

				body = JSON.stringify(bodyWithDefaultParams);
			} catch(e) { }
			
			return this.http.post(baseUrl, body, { headers: headers });
        };

		return this.runRequestWithRetry(config, postReqStrategy);
	}

	public uploadFile(file: File): Observable<UploadedFileResponse> {
		let url = new ServerApiBuilder(ThServerApi.ServiceUploadFile).getBaseUrl();
		return new Observable<UploadedFileResponse>((observer: Observer<UploadedFileResponse>) => {
			if (file.size > ThOAuthHttp.MaxFileSizeBytes) {
				var thError = new ThError(this.thTranslation.translate("The maximum file size is 16MB"));
				observer.error(thError);
				observer.complete();
				return;
			}
			let formData: FormData = new FormData();
			formData.append("file", file, file.name);
			let xhr: XMLHttpRequest = new XMLHttpRequest();

			xhr.onreadystatechange = () => {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						var resultJson = JSON.parse(xhr.response);
						this.helper.parseJsonResult(resultJson, observer);
					} else {
						observer.error(xhr.response);
					}
				}
			};

			let accessToken = this.tokenService.accessToken;
			let bearer = "Bearer " + accessToken;

			xhr.open('POST', url, true);
			xhr.setRequestHeader("Authorization", bearer);			
			xhr.send(formData);
		});
	}

	private getDefaultReqParams(): Object {
		return {
			thLocale: this.thTranslation.locale
		}
	}

	private runRequestWithRetry<Object>(config: RequestConfiguration, httpRequestStrategy: RequestStrategyFunc): Observable<Object> {
		let request = (): Observable<Object> => {
            return this.helper.runRequest(config, httpRequestStrategy);
        };
		
        return new Observable((observer: Observer<Object>) => {
            function onSuccessRequest(data) {
                observer.next(data);
                observer.complete();
            }

            function onErrorRequest(err) {
                observer.error(err);
                observer.complete();
            }

            request().subscribe(onSuccessRequest, (err: any) => {
                if (err.status == HttpStatusCode.Forbidden) {
                    this.syncronizedRefreshToken(() => {
                        request().subscribe(onSuccessRequest, onErrorRequest);
                    });
                    return;
                }
                onErrorRequest(err);
            });
        });
    }	

	private syncronizedRefreshToken(callback: Function) {
		if (!this.refreshTokenObservable) {
			this.refreshTokenObservable = this.helper.refreshToken().share();
		}
		this.refreshTokenObservable.subscribe((token: TokenDO) => {
			this.refreshTokenObservable = null;
			this.tokenService.token = token;
			callback();
		}, (err: any) => {
			this.browserLocation.goToLoginPage(LoginStatusCode.SessionTimeout);
		});
	}
}