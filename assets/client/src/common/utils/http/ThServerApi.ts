export enum ThServerApi {
	AccountSignUp,
	AccountLogIn,
	AccountRequestResetPassword,
	AccountResetPassword,
	HotelDetails,
	HotelDetailsUpdateBasicInfo,
    HotelDetailsUpdatePaymentsAndPolicies,
    HotelDetailsUpdatePropertyDetails,
	SettingsHotelAmenities,
	SettingsPaymentMethods,
	SettingsCountries,
	SettingsCurrencies,
	SettingsAddOnProductCategories,
    SettingsBedTemplates,
	ServiceUploadFile,
	ServiceVatVerifier,
    ServiceTimezones,
	Taxes,
	TaxesSaveItem,
	AddOnProducts,
	AddOnProductsCount,
	AddOnProductsSaveItem,
	AddOnProductsDeleteItem,
    Beds,
    BedsCount,
    BedsSaveItem,
    BedsDeleteItem,
	RoomCategories,
	RoomCategoriesSaveItem,
	RoomCategoriesStats,
	RoomsUsedRoomCategories
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
ThServerApiUrl[ThServerApi.SettingsAddOnProductCategories] = "/settings/addOnProductCategories";
ThServerApiUrl[ThServerApi.SettingsBedTemplates] = "/settings/bedTemplates";
ThServerApiUrl[ThServerApi.ServiceUploadFile] = "/service/uploadFile";
ThServerApiUrl[ThServerApi.ServiceVatVerifier] = "/service/vatVerifier";
ThServerApiUrl[ThServerApi.ServiceTimezones] = "/service/availableTimeZones";
ThServerApiUrl[ThServerApi.HotelDetailsUpdateBasicInfo] = "/hotel/updateBasicInfo";
ThServerApiUrl[ThServerApi.HotelDetailsUpdatePaymentsAndPolicies] = "/hotel/updatePaymentsAndPolicies";
ThServerApiUrl[ThServerApi.HotelDetailsUpdatePropertyDetails] = "/hotel/updatePropertyDetails";
ThServerApiUrl[ThServerApi.Taxes] = "/taxes";
ThServerApiUrl[ThServerApi.TaxesSaveItem] = "/taxes/saveTaxItem";
ThServerApiUrl[ThServerApi.AddOnProducts] = "/addOnProducts";
ThServerApiUrl[ThServerApi.AddOnProductsCount] = "/addOnProducts/count";
ThServerApiUrl[ThServerApi.AddOnProductsSaveItem] = "/addOnProducts/saveAddOnProductItem";
ThServerApiUrl[ThServerApi.AddOnProductsDeleteItem] = "/addOnProducts/deleteAddOnProductItem";
ThServerApiUrl[ThServerApi.Beds] = "/beds";
ThServerApiUrl[ThServerApi.BedsCount] = "/beds/count";
ThServerApiUrl[ThServerApi.BedsSaveItem] = "/beds/saveBedItem";
ThServerApiUrl[ThServerApi.BedsDeleteItem] = "/beds/deleteBedItem";
ThServerApiUrl[ThServerApi.RoomCategories] = "/roomCategories";
ThServerApiUrl[ThServerApi.RoomCategoriesSaveItem] = "/roomCategories/saveRoomCategoryItem";
ThServerApiUrl[ThServerApi.RoomCategoriesStats] = "/roomsCategories/stats";
ThServerApiUrl[ThServerApi.RoomsUsedRoomCategories] = "/rooms/usedRoomCategories";

export class ServerApiBuilder {
	public static ApiRoot = "/api";

	constructor(private _thServerApi: ThServerApi) {
	}

	public getUrl(): string {
		return ServerApiBuilder.ApiRoot + ThServerApiUrl[this._thServerApi];
	}
}