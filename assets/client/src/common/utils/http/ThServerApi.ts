export enum ThServerApi {
	AccountSignUp,
	AccountLogIn,
	AccountLogOut,
	AccountRequestResetPassword,
	AccountResetPassword,
	HotelDetails,
	HotelDetailsUpdateBasicInfo,
    HotelDetailsUpdatePaymentsAndPolicies,
    HotelDetailsUpdatePropertyDetails,
	HotelDetailsMarkConfigurationCompleted,
	SettingsHotelAmenities,
	SettingsPaymentMethods,
	SettingsCountries,
	SettingsCurrencies,
	SettingsAddOnProductCategories,
    SettingsBedTemplates,
    SettingsRoomAmenities,
    SettingsRoomAttributes,
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
    Rooms,
    RoomsCount,
    RoomsSaveItem,
    RoomsDeleteItem,
	RoomCategories,
	RoomCategoriesSaveItem,
	RoomCategoriesStats,
	UsedRoomCategoriesStats,
	RoomsUsedRoomCategories,
	HotelConfigurationsYieldFilters,
	HotelConfigurationsSaveYieldFilterValue,
	PriceProducts,
	PriceProductsCount,
	PriceProductsSaveItem,
	PriceProductsArchiveItem,
	PriceProductsDeleteItem,
	PriceProductsDraftItem,
	Customers,
	CustomersCount,
	CustomersSaveItem,
	Allotments,
	AllotmentsCount,
	AllotmentsSaveItem,
	AllotmentsArchiveItem,

	Notifications,
	NotificationsCount,
	NotificationsMarkAsRead,
	BookingsSearch,
	BookingsAdd,
	Bookings,
	BookingsCount,
	BookingsOccupancy,
	BookingsItem,

	HotelOperationsDashboardArrivals,
	HotelOperationsDashboardDepartures,
	HotelOperationsDashboardRooms,

	HotelOperationsRoomCheckIn,
	HotelOperationsRoomReserve,
	HotelOperationsRoomChange,
	HotelOperationsRoomCheckOut,
	HotelOperationsRoomChangeMaintenanceStatus,
	HotelOperationsRoomGetAttachedBooking,

	HotelOperationsBookingPossiblePrices,
	HotelOperationsBookingChangeDates,
	HotelOperationsBookingChangeNoShowTime,

	HotelOperationsCommonHotelTimestamp,

}

var ThServerApiUrl: { [index: number]: string; } = {};
ThServerApiUrl[ThServerApi.AccountSignUp] = "/account/signUp";
ThServerApiUrl[ThServerApi.AccountLogIn] = "/account/logIn";
ThServerApiUrl[ThServerApi.AccountLogOut] = "/account/logOut";
ThServerApiUrl[ThServerApi.AccountRequestResetPassword] = "/account/requestResetPassword";

ThServerApiUrl[ThServerApi.AccountResetPassword] = "/account/resetPassword";
ThServerApiUrl[ThServerApi.HotelDetails] = "/hotel/details";

ThServerApiUrl[ThServerApi.SettingsHotelAmenities] = "/settings/hotelAmenities";
ThServerApiUrl[ThServerApi.SettingsPaymentMethods] = "/settings/paymentMethods";
ThServerApiUrl[ThServerApi.SettingsCurrencies] = "/settings/currencies";
ThServerApiUrl[ThServerApi.SettingsCountries] = "/settings/countries";
ThServerApiUrl[ThServerApi.SettingsAddOnProductCategories] = "/settings/addOnProductCategories";
ThServerApiUrl[ThServerApi.SettingsBedTemplates] = "/settings/bedTemplates";
ThServerApiUrl[ThServerApi.SettingsRoomAmenities] = "/settings/roomAmenities";
ThServerApiUrl[ThServerApi.SettingsRoomAttributes] = "/settings/roomAttributes";
ThServerApiUrl[ThServerApi.ServiceUploadFile] = "/service/uploadFile";
ThServerApiUrl[ThServerApi.ServiceVatVerifier] = "/service/vatVerifier";
ThServerApiUrl[ThServerApi.ServiceTimezones] = "/service/availableTimeZones";
ThServerApiUrl[ThServerApi.HotelDetailsUpdateBasicInfo] = "/hotel/updateBasicInfo";
ThServerApiUrl[ThServerApi.HotelDetailsUpdatePaymentsAndPolicies] = "/hotel/updatePaymentsAndPolicies";
ThServerApiUrl[ThServerApi.HotelDetailsUpdatePropertyDetails] = "/hotel/updatePropertyDetails";
ThServerApiUrl[ThServerApi.HotelDetailsMarkConfigurationCompleted] = "/hotel/markConfigurationCompleted";
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
ThServerApiUrl[ThServerApi.Rooms] = "/rooms";
ThServerApiUrl[ThServerApi.RoomsCount] = "/rooms/count";
ThServerApiUrl[ThServerApi.RoomsSaveItem] = "/rooms/saveRoomItem";
ThServerApiUrl[ThServerApi.RoomsDeleteItem] = "/rooms/deleteRoomItem";
ThServerApiUrl[ThServerApi.RoomCategories] = "/roomCategories";
ThServerApiUrl[ThServerApi.RoomCategoriesSaveItem] = "/roomCategories/saveRoomCategoryItem";
ThServerApiUrl[ThServerApi.RoomCategoriesStats] = "/roomCategories/stats";
ThServerApiUrl[ThServerApi.UsedRoomCategoriesStats] = "/usedRoomCategories/stats";
ThServerApiUrl[ThServerApi.RoomsUsedRoomCategories] = "/rooms/usedRoomCategories";
ThServerApiUrl[ThServerApi.HotelConfigurationsYieldFilters] = "/hotelConfigurations/yieldFilters";
ThServerApiUrl[ThServerApi.HotelConfigurationsSaveYieldFilterValue] = "/hotelConfigurations/saveYieldFilterValue";
ThServerApiUrl[ThServerApi.PriceProducts] = "/priceProducts";
ThServerApiUrl[ThServerApi.PriceProductsCount] = "/priceProducts/count";
ThServerApiUrl[ThServerApi.PriceProductsSaveItem] = "/priceProducts/savePriceProductItem";
ThServerApiUrl[ThServerApi.PriceProductsArchiveItem] = "/priceProducts/archivePriceProductItem";
ThServerApiUrl[ThServerApi.PriceProductsDeleteItem] = "/priceProducts/deletePriceProductItem";
ThServerApiUrl[ThServerApi.PriceProductsDraftItem] = "/priceProducts/draftPriceProductItem";
ThServerApiUrl[ThServerApi.Customers] = "/customers";
ThServerApiUrl[ThServerApi.CustomersCount] = "/customers/count";
ThServerApiUrl[ThServerApi.CustomersSaveItem] = "/customers/saveCustomerItem";
ThServerApiUrl[ThServerApi.Allotments] = "/allotments";
ThServerApiUrl[ThServerApi.AllotmentsCount] = "/allotments/count";
ThServerApiUrl[ThServerApi.AllotmentsSaveItem] = "/allotments/saveAllotmentItem";
ThServerApiUrl[ThServerApi.AllotmentsArchiveItem] = "/allotments/archiveAllotmentItem";

ThServerApiUrl[ThServerApi.Notifications] = "/notifications";
ThServerApiUrl[ThServerApi.NotificationsCount] = "/notifications/count";
ThServerApiUrl[ThServerApi.NotificationsMarkAsRead] = "/notifications/markNotificationsAsRead";
ThServerApiUrl[ThServerApi.BookingsSearch] = "/bookings/search";
ThServerApiUrl[ThServerApi.BookingsAdd] = "/bookings/add";
ThServerApiUrl[ThServerApi.Bookings] = "/bookings";
ThServerApiUrl[ThServerApi.BookingsCount] = "/bookings/count";
ThServerApiUrl[ThServerApi.BookingsOccupancy] = "/bookings/occupancy";
ThServerApiUrl[ThServerApi.BookingsItem] = "/bookings/bookingItem";

ThServerApiUrl[ThServerApi.HotelOperationsDashboardArrivals] = "/hotelOperations/dashboard/arrivals";
ThServerApiUrl[ThServerApi.HotelOperationsDashboardDepartures] = "/hotelOperations/dashboard/departures";
ThServerApiUrl[ThServerApi.HotelOperationsDashboardRooms] = "/hotelOperations/dashboard/rooms";

ThServerApiUrl[ThServerApi.HotelOperationsRoomCheckIn] = "/hotelOperations/room/checkIn";
ThServerApiUrl[ThServerApi.HotelOperationsRoomReserve] = "/hotelOperations/room/reserve";
ThServerApiUrl[ThServerApi.HotelOperationsRoomChange] = "/hotelOperations/room/change";
ThServerApiUrl[ThServerApi.HotelOperationsRoomCheckOut] = "/hotelOperations/room/checkOut";
ThServerApiUrl[ThServerApi.HotelOperationsRoomChangeMaintenanceStatus] = "/hotelOperations/room/maintenanceStatus";
ThServerApiUrl[ThServerApi.HotelOperationsRoomGetAttachedBooking] = "/hotelOperations/room/attachedBooking";

ThServerApiUrl[ThServerApi.HotelOperationsBookingPossiblePrices] = "/hotelOperations/booking/possiblePrices";
ThServerApiUrl[ThServerApi.HotelOperationsBookingChangeDates] = "/hotelOperations/booking/changeDates";
ThServerApiUrl[ThServerApi.HotelOperationsBookingChangeNoShowTime] = "/hotelOperations/booking/changeNoShowTime";

ThServerApiUrl[ThServerApi.HotelOperationsCommonHotelTimestamp] = "/hotelOperations/common/hotelTimestamp";

export class ServerApiBuilder {
	public static ApiRoot = "/api";

	constructor(private _thServerApi: ThServerApi) {
	}

	public getUrl(): string {
		return ServerApiBuilder.ApiRoot + ThServerApiUrl[this._thServerApi];
	}
}