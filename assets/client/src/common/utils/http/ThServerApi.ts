export enum ThServerApi {
	AccountSignUp,
	AccountLogIn,
	AccountRequestResetPassword,
	AccountResetPassword,
	HotelDetails,
	HotelDetailsUpdateBasicInfo,
    HotelDetailsUpdatePaymentsAndPolicies,
	SettingsHotelAmenities,
	SettingsPaymentMethods,
	SettingsCountries,
	SettingsCurrencies,
	ServiceUploadFile,
	ServiceVatVerifier,
	Taxes,
	TaxesSaveItem
}

var ThServerApiUrl: { [index: number]: string; } = {};
ThServerApiUrl[ThServerApi.AccountSignUp] = "/account/signUp";
ThServerApiUrl[ThServerApi.AccountLogIn] = "/account/logIn";
ThServerApiUrl[ThServerApi.AccountRequestResetPassword] = "/account/requestResetPassword";
ThServerApiUrl[ThServerApi.AccountResetPassword] = "/account/resetPassword";
ThServerApiUrl[ThServerApi.HotelDetails] = "/hotel/details";

ThServerApiUrl[ThServerApi.SettingsHotelAmenities] = "/settings/hotelAmenities";
ThServerApiUrl[ThServerApi.SettingsPaymentMethods] = "/settings/paymentMethods";
ThServerApiUrl[ThServerApi.SettingsCurrencies] = "/settings/currencies";
ThServerApiUrl[ThServerApi.SettingsCountries] = "/settings/countries";
ThServerApiUrl[ThServerApi.ServiceUploadFile] = "/service/uploadFile";
ThServerApiUrl[ThServerApi.ServiceVatVerifier] = "/service/vatVerifier";
ThServerApiUrl[ThServerApi.HotelDetailsUpdateBasicInfo] = "/hotel/updateBasicInfo";
ThServerApiUrl[ThServerApi.HotelDetailsUpdatePaymentsAndPolicies] = "/hotel/updatePaymentsAndPolicies";
ThServerApiUrl[ThServerApi.Taxes] = "/taxes";
ThServerApiUrl[ThServerApi.TaxesSaveItem] = "/taxes/saveTaxItem";

export class ServerApiBuilder {
	public static ApiRoot = "/api";

	constructor(private _thServerApi: ThServerApi) {
	}

	public getUrl(): string {
		return ServerApiBuilder.ApiRoot + ThServerApiUrl[this._thServerApi];
	}
}