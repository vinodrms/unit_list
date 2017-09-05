import { Injectable, Inject } from "@angular/core";
import { Response, Http, Headers, URLSearchParams } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";

import { ThError } from "../../AppContext";
import { ThOAuthHttp } from "./ThOAuthHttp";
import { LoginStatusCode } from "../../responses/LoginStatusCode";
import { IBrowserLocation } from "../../browser-location/IBrowserLocation";
import { ThUtils } from "../../ThUtils";
import { TokenDO } from "../../oauth-token/TokenDO";
import { ThServerApi, ServerApiBuilder } from "../ThServerApi";
import { ITokenService } from "../../oauth-token/ITokenService";
import { RequestConfiguration } from "../IThHttp";
import { HttpStatusCode } from "../HttpStatusCode";

import * as _ from "underscore";

export type RequestStrategyFunc = (baseUrl: string, queryParameters: Object, headers: Headers, body?: string) => Observable<Response>;

enum ThStatusCode {
	Ok
}

export class ThOAuthHttpHelper {

	private thUtils: ThUtils;

	constructor(private browserLocation: IBrowserLocation,
		private tokenService: ITokenService,
		private http: Http) {
		this.thUtils = new ThUtils();
	}

	public parseError(error: any, observer: Observer<Object>) {
		if (error.status == HttpStatusCode.Forbidden) {
			this.browserLocation.goToLoginPage(LoginStatusCode.SessionTimeout);
			observer.error(error);
			return;
		}

		var resultJson: Object = error.json();
		observer.error(new ThError(resultJson["message"]));
		observer.complete();
	}

	public parseResult(result: Response, observer: Observer<Object>) {
		if (result.status == HttpStatusCode.Ok) {
			var resultJson: Object = result.json();
			this.parseJsonResult(resultJson, observer);
		}
		else if (result.status == HttpStatusCode.Forbidden) {
			this.browserLocation.goToLoginPage(LoginStatusCode.SessionTimeout);
			observer.error(result);
		}
		else {
			observer.error(new ThError(result.statusText));
			observer.complete();
		}
	}
	public parseJsonResult(resultJson: Object, observer: Observer<Object>) {
		if (resultJson["statusCode"] == ThStatusCode.Ok) {
			observer.next(resultJson["data"]);
			observer.complete();
			return;
		}
		observer.error(new ThError(resultJson["message"]));
		observer.complete();
	}

	public buildSearchParameters(parameters: Object): URLSearchParams {
		let urlSearchParams: URLSearchParams = new URLSearchParams();
		if (this.thUtils.isUndefinedOrNull(parameters)) {
			return urlSearchParams;
		}
		var keys = Object.keys(parameters);
		keys.forEach(key => {
			urlSearchParams.set(key, parameters[key]);
		});
		return urlSearchParams;
	}

	public runRequest(config: RequestConfiguration, httpRequestStrategy: RequestStrategyFunc): Observable<Object> {
		let baseUrl = new ServerApiBuilder(config.serverApi).getBaseUrl();

		return new Observable((observer: Observer<Object>) => {
			let headers = this.generateHeaders(config.headers);
			
			httpRequestStrategy(baseUrl, config.queryParameters, headers, config.body).subscribe((res) => {
				this.parseResult(res, observer);
			}, (err: any) => {
				this.parseError(err, observer);
			});
		});
	}

	public refreshToken(): Observable<TokenDO> {
		let postReqStrategy: RequestStrategyFunc = (baseUrl, queryParameters, headers, body) => {
			return this.http.post(baseUrl, body, { headers: headers });
		};

		let clientId = ServerApiBuilder.ClientId;
		let refreshToken = encodeURIComponent(this.tokenService.refreshToken);

		let body = `client_id=${clientId}&grant_type=refresh_token&refresh_token=${refreshToken}`;

		let headers = {};
		headers['Content-Type'] = 'application/x-www-form-urlencoded';

		let config = {
			serverApi: ThServerApi.AccountRefreshToken,
			headers: headers,
			body: body
		};

		return this.runRequest(config, postReqStrategy).map((res: Object) => {
			let token = new TokenDO();
			token.buildFromObject(res);
			return token;
		});
	}

	private generateHeaders(options: Object): Headers {
		let headers = new Headers();

		let headerOptions = this.getHeaderOptions(options);
		Object.keys(headerOptions).forEach(hName => {
			headers.append(hName, headerOptions[hName]);
		});

		return headers;
	}

	private getHeaderOptions(options: Object): { [name: string]: string } {
		let defaultHeaderOptions = this.getDefaultHeadersOptions();
		let headerOptions = defaultHeaderOptions;

		if (_.isObject(options)) {
			Object.keys(options).forEach((key: string) => {
				headerOptions[key] = options[key];
			});
		}

		return headerOptions;
	}

	private getDefaultHeadersOptions(): { [name: string]: string } {
		let headerOptions: { [name: string]: string } = {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		};

		let accessToken = this.tokenService.accessToken;
		if (!this.thUtils.isUndefinedOrNull(accessToken)) {
			headerOptions["Authorization"] = "Bearer " + accessToken;
		}

		return headerOptions;
	}
}