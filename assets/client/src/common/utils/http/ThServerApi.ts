export enum ThServerApi {
	AccountSignUp,
	AccountLogIn,
	AccountRequestResetPassword,
	AccountResetPassword,
	HotelDetails,
	
	SettingsHotelAmenities,
	SettingsPaymentMethods
}

var ThServerApiUrl: { [index: number]: string; } = {};
ThServerApiUrl[ThServerApi.AccountSignUp] = "/account/signUp";
ThServerApiUrl[ThServerApi.AccountLogIn] = "/account/logIn";
ThServerApiUrl[ThServerApi.AccountRequestResetPassword] = "/account/requestResetPassword";
ThServerApiUrl[ThServerApi.AccountResetPassword] = "/account/resetPassword";
ThServerApiUrl[ThServerApi.HotelDetails] = "/hotel/details";

ThServerApiUrl[ThServerApi.SettingsHotelAmenities] = "/settings/hotelAmenities";
ThServerApiUrl[ThServerApi.SettingsPaymentMethods] = "/settings/paymentMethods";

export class ServerApiBuilder {
	public static ApiRoot = "/api";

	constructor(private _thServerApi: ThServerApi) {
	}

	public getUrl(): string {
		return ServerApiBuilder.ApiRoot + ThServerApiUrl[this._thServerApi];
	}
}