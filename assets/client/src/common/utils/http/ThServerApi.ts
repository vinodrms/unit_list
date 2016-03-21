export enum ThServerApi {
	AccountSignUp,
	AccountLogIn,
	AccountRequestResetPassword,
	AccountResetPassword
}

var ThServerApiUrl: { [index: number]: string; } = {};
ThServerApiUrl[ThServerApi.AccountSignUp] = "/account/signUp";
ThServerApiUrl[ThServerApi.AccountLogIn] = "/account/logIn";
ThServerApiUrl[ThServerApi.AccountRequestResetPassword] = "/account/requestResetPassword";
ThServerApiUrl[ThServerApi.AccountResetPassword] = "/account/resetPassword";

export class ServerApiBuilder {
	public static ApiRoot = "/api";

	constructor(private _thServerApi: ThServerApi) {
	}

	public getUrl(): string {
		return ServerApiBuilder.ApiRoot + ThServerApiUrl[this._thServerApi];
	}
}