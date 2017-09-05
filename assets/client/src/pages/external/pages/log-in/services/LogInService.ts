import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Injectable, Inject } from '@angular/core';
import { Http, Headers } from "@angular/http";
import { Observer } from "rxjs";
import { Observable } from 'rxjs/Observable';

import { AppContext, ThServerApi } from '../../../../../common/utils/AppContext';
import { ThValidators } from '../../../../../common/utils/form-utils/ThFormUtils';
import { CredentialsDO } from '../data-objects/CredentialsDO';
import { ServerApiBuilder } from "../../../../../common/utils/http/ThServerApi";
import { ITokenService } from "../../../../../common/utils/oauth-token/ITokenService";
import { TokenDO } from "../../../../../common/utils/oauth-token/TokenDO";

@Injectable()
export class LogInService {
	private _loginForm: FormGroup;

	constructor(private _appContext: AppContext,
		private http: Http, 
		private _formBuilder: FormBuilder) {
		this.initLoginForm();
	}
	private initLoginForm() {
		this._loginForm = this._formBuilder.group({
			"email": ["", Validators.required],
			"password": ["", Validators.required]
		})
	}

	public isValid(): boolean {
		return this.loginForm.valid;
	}

	public logIn(): Observable<any> {
		let clientId = ServerApiBuilder.ClientId;

		let credentials = new CredentialsDO();
		credentials.buildFromObject(this._loginForm.value);
		let username = encodeURIComponent(credentials.email);
		let password = encodeURIComponent(credentials.password);

		let headers = {};
		headers['Content-Type'] = 'application/x-www-form-urlencoded';

		let data = `client_id=${clientId}&grant_type=password&username=${username}&password=${password}`;

		return this._appContext.thHttp.post({
			serverApi: ThServerApi.AccountLogIn,
			body: data,
			headers: headers
		}).map((response) => {
			let tokenDO = new TokenDO();
			tokenDO.buildFromObject(response);
			this._appContext.tokenService.token = tokenDO;

            return response;
        });
	}

	public isAuthenticated(): Observable<any> {
		let baseUrl = new ServerApiBuilder(ThServerApi.AccountIsAuthenticated).getBaseUrl();
		let headers = new Headers();
		headers.append("Authorization", "Bearer " + this._appContext.tokenService.accessToken);
		
		//We don't need the standard 401 handling -> the standard handling would cause an infinite
		//loop in the login screen
		return new Observable((observer: Observer<Object>) => {
			this.http.post(baseUrl, {}, { headers: headers }).subscribe((res) => {
				observer.next(res);
				observer.complete();
			}, (err: any) => {
				observer.error(err);
				observer.complete();
			});
		});
	}

	public get loginForm(): FormGroup {
		return this._loginForm;
	}
	public set loginForm(loginForm: FormGroup) {
		this._loginForm = loginForm;
	}
}