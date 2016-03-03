import {Locales, Translation} from '../localization/Translation';
import {ThUtils} from '../ThUtils';

export enum ThStatusCode {
	Ok,
	InternalServerError,
	DataValidationError,
	DataEmailValidationError,
	DataPasswordValidationError,
	ErrorBootstrappingApp,
	ErrorCleaningRepositories,
	InvalidRequestParameters,
	VatProviderErrorCheckingVat,
	VatProviderNotInEu,
	VatProviderInvalidVat,
    VatProviderInvalidCountryCode,
	VatProviderProxyServiceNonEuCountry,
	EmailTemplateBuilderProblemFindingTemplatesDirectory,
	EmailTemplateBuilderProblemBuildingContent,
	SendGridServiceErrorSendingEmail,
	HotelSignUpError,
	HotelRepositoryAccountAlreadyExists,
	HotelRepositoryErrorAddingHotel,
	HotelLoginError,
	PassportLoginServiceInvalidLogin,
	PassportLoginServiceErrorInvalidLogin,
	HotelRepositoryErrorFindingAccount,
	HotelRepositoryAccountNotFound,
	HotelAuthenticationAccountNotActive,
	HotelAuthenticationErrorQueryingRepository,
	HotelAuthenticationInvalidEmailOrPassword,
	HotelRepositoryErrorActivatingAccount,
	UserAccountActivationErrorActivatingAccount,
	HotelRepositoryAccountCouldNotBeActivated,
	HotelActivateError,
	AccControllerErrorInitializingSession,
	SessionManagerErrorInitializingSession,
	HotelRepositoryProblemUpdatingPasswordToken,
	HotelRepositoryErrorUpdatingPasswordToken,
	UserAccountRequestResetPasswordError,
	AccControllerErrorRequestingResetPassword,
	HotelRepositoryCouldNotResetPassword,
	HotelRepositoryErrorCouldNotResetPassword,
	UserAccountResetPasswordError,
	AccControllerErrorResettingPassword,
    ImageStorageServiceErrorUploadingImage,
    CloudinaryImageStorageServiceErrorUploadingImage,
    ImageUploadControllerErrorUploadingImage,
    ImageUploadControllerNoFilesToUpload,
    ImageUploadControllerGenericError,
    SettingsRepositoryAddDuplicateKeyError,
    SettingsRepositoryAddError,
    SettingsMongoRepositoryReadError,
	SettingsRepositoryNotFound,
    RepositoryGetNetiveEntityError,
    PatchErrorEnsuringUniqueIndexOnSettings,
	HotelGetDetailsError,
	HotelGetDetailsErrorFormattingResponse,
	HotelGetDetailsErrorFindingUserByEmail,
	HotelDetailsControllerErrorGettingDetails,
	HotelDetailsControllerErrorUpdatingBasicInfo,
	HotelDetailsControllerErrorAddingPaymentsAndPolicies,
	HotelDetailsControllerErrorUpdatingPaymentMethods,
	HotelDetailsControllerErrorSavingTaxItem,
	HotelRepositoryHotelIdNotFound,
	HotelRepositoryErrorFindingHotelById,
	HotelDetailsRepositoryProblemUpdatingAccount,
	HotelDetailsRepositoryErrorUpdatingAccount,
	PaymentMethodIdListValidatorInvalid,
	PaymentMethodIdListValidatorError,
	HotelAddPaymentsPoliciesErrorPrecheckingConstraints,
	HotelAddPaymentPoliciesInvalidTaxes,
	HotelAddPaymentsPoliciesError,
	HotelAddPaymentPoliciesInvalidCurrencyCode,
    RoomRepositoryErrorGettingRoomList,
    RoomRepositoryErrorGettingRoom,
    RoomRepositoryErrorReadingCategoryIdList,
    RoomCategoryRepositoryErrorGettingRoomCategoryList,
    RoomCategoryRepositoryErrorGettingRoomCategory,
    RoomCategoryRepositoryNameAlreadyExists,
    RoomCategoryRepositoryErrorAddingRoomCategory,
    SaveRoomCategoryItemError,
    DeleteRoomCategoryItemError,
    RoomCategoryItemUpdateStrategyErrorUpdating,
    BedRepositoryErrorGettingBedList,
    BedRepositoryErrorGettingBed,
    BedRepositoryBedNotFound,
    BedRepositoryErrorAddingBed,
    BedRepositoryNameAlreadyExists,
    BedRepositoryErrorUpdatingBed,
    BedItemUpdateStrategyErrorUpdating,
    SaveBedItemError,
    SaveBedItemInvalidBedTemplateId,
    DeleteBedItemErrorDeleting,
    DeleteBedItemErrorValidating,
    DeleteBedItemError,
    BedControllerErrorGettingBeds,
	BedControllerErrorSavingBed,
	BedControllerErrorDeletingBed,
    BedControllerErrorGettingBedById,
	HotelUpdatePaymentsPoliciesErrorPrecheckingConstraints,
	HotelUpdatePaymentPoliciesInvalidTaxes,
	HotelUpdatePaymentsPoliciesError,
	HotelUpdatePaymentPoliciesInvalidCurrencyCode,
	HotelSaveTaxItemError,
	HotelSaveTaxItemValidationProblem,
	TaxItemUpdateStrategyErrorUpdating,
	HotelUpdatePropertyDetailsUpdateError,
	HotelUpdatePropertyDetailsValidationError,
	HotelUpdatePropertyDetailsInvalidAmenityIdList,
	HotelUpdatePropertyDetailsInvalidOperationHours,
	HotelUpdatePropertyDetailsInvalidTimezone,
	HotelDetailsControllerErrorUpdatingPropertyDetails,
	TaxRepositoryErrorGettingTaxList,
	TaxRepositoryErrorGettingTax,
	TaxRepositoryNameAlreadyExists,
	TaxRepositoryErrorAddingTax,
	TaxRepositoryProblemUpdatingTax,
	TaxRepositoryErrorUpdatingTax,
	TaxRepositoryTaxNotFound,
	HotelDeleteTaxItemError,
	HotelDeleteTaxItemErrorDeleting,
	HotelDeleteTaxItemErrorValidating,
	TaxControllerErrorGettingTaxes,
	TaxControllerErrorSavingTax,
	TaxControllerErrorDeletingTax,
	AddOnProductRepositoryProblemUpdatingAddOnProduct,
	AddOnProductRepositoryErrorUpdatingAddOnProduct,
	AddOnProductRepositoryNameAlreadyExists,
	AddOnProductRepositoryErrorAddingAddOnProduct,
	AddOnProductRepositoryProductNotFound,
	AddOnProductRepositoryErrorGettingAddOnProduct,
	AddOnProductRepositoryErrorReadingCategoryIdList,
	AddOnProductRepositoryErrorReadingDocumentCount,
	AddOnProductRepositoryErrorGettingList,
	SaveAddOnProductItemError,
	SaveAddOnProductItemInvalidCategoryId,
	SaveAddOnProductItemInvalidTaxId,
	AddOnProductItemUpdateStrategyErrorUpdating,
	DeleteAddOnProductItemError,
	DeleteAddOnProductItemErrorValidating,
	AddOnProductsControllerErrorGettingAddOnProduct,
	AddOnProductsControllerErrorSavingAddOnProduct,
	AddOnProductsControllerErrorDeletingAddOnProduct,
	AddOnProductsControllerErrorGettingCategoryIdList,
	AddOnProductsControllerErrorGettingCount,
	AddOnProductsControllerErrorGettingList,
	CustomerRepositoryCustomerNotFound,
	CustomerRepositoryErrorGettingCustomer,
	CustomerRepositoryErrorCreatingCustomer,
	CustomerRepositoryProblemUpdatingCustomer,
	CustomerRepositoryErrorUpdatingCustomer,
	CustomerRepositoryErrorReadingCustomerCount,
	CustomerRepositoryErrorGettingList,
	SaveCustomerItemError,
	SaveCustomerItemInvalidOrNullClientType,
	SaveCustomerItemCompOrTACannotBeLinkedToOtherCustomers,
	SaveCustomerItemCannotSetPriceProductsForPublic,
	SaveCustomerItemInvalidPriceProductIdList,
	CustomerItemUpdateStrategyError,
	CustomersControllerErrorGettingCustomer,
	CustomersControllerErrorSavingCustomer,
	CustomersControllerErrorGettingCount,
	CustomersControllerErrorGettingList
}

var ThMessage: { [index: number]: string; } = {};
ThMessage[ThStatusCode.Ok] = "Ok";
ThMessage[ThStatusCode.InternalServerError] = "Internal Server Error.";
ThMessage[ThStatusCode.DataValidationError] = "Error validating data.";
ThMessage[ThStatusCode.DataEmailValidationError] = "Error validating email.";
ThMessage[ThStatusCode.DataPasswordValidationError] = "Error validating password.";
ThMessage[ThStatusCode.ErrorBootstrappingApp] = "Error Bootstrapping App.";
ThMessage[ThStatusCode.ErrorCleaningRepositories] = "Error Cleaning Repositories.";
ThMessage[ThStatusCode.InvalidRequestParameters] = "Invalid Request Parameters.";
ThMessage[ThStatusCode.VatProviderErrorCheckingVat] = "Error checking VAT number.";
ThMessage[ThStatusCode.VatProviderNotInEu] = "The VAT is not in EU";
ThMessage[ThStatusCode.VatProviderInvalidVat] = "Invalid VAT number.";
ThMessage[ThStatusCode.VatProviderInvalidCountryCode] = "Invalid country code";
ThMessage[ThStatusCode.VatProviderProxyServiceNonEuCountry] = "Non EU Country";
ThMessage[ThStatusCode.EmailTemplateBuilderProblemFindingTemplatesDirectory] = "Error sending email: the content was not found on the server. Please contact the Administrator.";
ThMessage[ThStatusCode.EmailTemplateBuilderProblemBuildingContent] = "Error sending email: problem building content. Please contact the Administrator.";
ThMessage[ThStatusCode.SendGridServiceErrorSendingEmail] = "Error sending email. Please contact the Administrator.";
ThMessage[ThStatusCode.HotelSignUpError] = "Error signing up. Please try again.";
ThMessage[ThStatusCode.HotelRepositoryAccountAlreadyExists] = "An account with this email already exists.";
ThMessage[ThStatusCode.HotelRepositoryErrorAddingHotel] = "Error adding the information. Please try again.";
ThMessage[ThStatusCode.HotelLoginError] = "Error signing in. Please try again.";
ThMessage[ThStatusCode.PassportLoginServiceInvalidLogin] = "Error signing in. Please try again.";
ThMessage[ThStatusCode.PassportLoginServiceErrorInvalidLogin] = "Error signing in. Please try again.";
ThMessage[ThStatusCode.HotelRepositoryErrorFindingAccount] = "Error finding account. Please try again.";
ThMessage[ThStatusCode.HotelRepositoryAccountNotFound] = "Invalid email or password.";
ThMessage[ThStatusCode.HotelAuthenticationAccountNotActive] = "The account is not active.";
ThMessage[ThStatusCode.HotelAuthenticationErrorQueryingRepository] = "Error logging in. Please check your credentials and try again.";
ThMessage[ThStatusCode.HotelAuthenticationInvalidEmailOrPassword] = "Invalid email or password.";
ThMessage[ThStatusCode.HotelRepositoryErrorActivatingAccount] = "There was a problem while activating your account.";
ThMessage[ThStatusCode.UserAccountActivationErrorActivatingAccount] = "There was a problem while activating your account.";
ThMessage[ThStatusCode.HotelRepositoryAccountCouldNotBeActivated] = "The account could not be activated.";
ThMessage[ThStatusCode.HotelActivateError] = "There was a problem while activating your account.";
ThMessage[ThStatusCode.AccControllerErrorInitializingSession] = "There was a problem while creating your session. Please try again.";
ThMessage[ThStatusCode.SessionManagerErrorInitializingSession] = "There was a problem while creating your session. Please try again.";
ThMessage[ThStatusCode.HotelRepositoryProblemUpdatingPasswordToken] = "The password could not be reset. Please check the email and try again.";
ThMessage[ThStatusCode.HotelRepositoryErrorUpdatingPasswordToken] = "There was a problem while resetting the password.";
ThMessage[ThStatusCode.UserAccountRequestResetPasswordError] = "There was a problem while resetting the password. Please contract the administrator if this problem persists.";
ThMessage[ThStatusCode.AccControllerErrorRequestingResetPassword] = "Problem resetting your password.";
ThMessage[ThStatusCode.HotelRepositoryCouldNotResetPassword] = "Problem while updating the new password. The link you used may expired.";
ThMessage[ThStatusCode.HotelRepositoryErrorCouldNotResetPassword] = "Problem while updating the new password.";
ThMessage[ThStatusCode.UserAccountResetPasswordError] = "There was a problem while changing the password. Please contract the administrator if this problem persists.";
ThMessage[ThStatusCode.AccControllerErrorResettingPassword] = "There was a problem while changing the password.";
ThMessage[ThStatusCode.ImageStorageServiceErrorUploadingImage] = "There was a problem while uploading the image.";
ThMessage[ThStatusCode.CloudinaryImageStorageServiceErrorUploadingImage] = "There was a problem while uploading the image.";
ThMessage[ThStatusCode.ImageUploadControllerErrorUploadingImage] = "There was a problem while uploading the image.";
ThMessage[ThStatusCode.ImageUploadControllerNoFilesToUpload] = "No images sent for the upload.";
ThMessage[ThStatusCode.ImageUploadControllerGenericError] = "Error uploading files. Please check the content and try again.";
ThMessage[ThStatusCode.SettingsRepositoryAddDuplicateKeyError] = "Error inserting setting (duplicate key error).";
ThMessage[ThStatusCode.SettingsRepositoryAddError] = "Error inserting setting.";
ThMessage[ThStatusCode.SettingsMongoRepositoryReadError] = "Error reading system setting.";
ThMessage[ThStatusCode.SettingsRepositoryNotFound] = "Setting not found.";
ThMessage[ThStatusCode.RepositoryGetNetiveEntityError] = "Error getting native entity for collection.";
ThMessage[ThStatusCode.PatchErrorEnsuringUniqueIndexOnSettings] = "Error ensuring unique index on settings collection.";
ThMessage[ThStatusCode.HotelGetDetailsError] = "Error getting details for the hotel. Please try again.";
ThMessage[ThStatusCode.HotelGetDetailsErrorFormattingResponse] = "Error updating the details for the hotel. Please try again.";
ThMessage[ThStatusCode.HotelGetDetailsErrorFindingUserByEmail] = "Error getting the details for the hotel. Please try again.";
ThMessage[ThStatusCode.HotelDetailsControllerErrorGettingDetails] = "Error getting the details for your hotel. Please try again.";
ThMessage[ThStatusCode.HotelDetailsControllerErrorUpdatingBasicInfo] = "Error updating the basic information. Please try again.";
ThMessage[ThStatusCode.HotelDetailsControllerErrorAddingPaymentsAndPolicies] = "Error adding payments and policies. Please try again.";
ThMessage[ThStatusCode.HotelDetailsControllerErrorUpdatingPaymentMethods] = "Error updating payment options. Please try again.";
ThMessage[ThStatusCode.HotelDetailsControllerErrorSavingTaxItem] = "Error saving the tax. Please try again.";
ThMessage[ThStatusCode.HotelRepositoryHotelIdNotFound] = "Problem getting the details for your hotel. Please try again.";
ThMessage[ThStatusCode.HotelRepositoryErrorFindingHotelById] = "Error getting the details for your hotel. Please try again.";
ThMessage[ThStatusCode.HotelDetailsRepositoryProblemUpdatingAccount] = "Problem updating the hotel's information. It is possible that someone else changed it at the same time. Please refresh the page and try again.";
ThMessage[ThStatusCode.HotelDetailsRepositoryErrorUpdatingAccount] = "Error updating hotel's information. Please try again.";
ThMessage[ThStatusCode.PaymentMethodIdListValidatorInvalid] = "Invalid payment methods submitted.";
ThMessage[ThStatusCode.PaymentMethodIdListValidatorError] = "Error validating payment method id list.";
ThMessage[ThStatusCode.HotelAddPaymentsPoliciesErrorPrecheckingConstraints] = "There was a problem while checking the payments and policies submitted.";
ThMessage[ThStatusCode.HotelAddPaymentPoliciesInvalidTaxes] = "Invalid taxes sent.";
ThMessage[ThStatusCode.HotelAddPaymentsPoliciesError] = "Error adding the payments and policies.";
ThMessage[ThStatusCode.HotelAddPaymentPoliciesInvalidCurrencyCode] = "Invalid currency code.";
ThMessage[ThStatusCode.BedRepositoryErrorGettingBedList] = "Error getting the bed list. Please try again.";
ThMessage[ThStatusCode.BedRepositoryErrorGettingBed] = "Error getting the bed. Please try again.";
ThMessage[ThStatusCode.BedRepositoryBedNotFound] = "Bed not found.";
ThMessage[ThStatusCode.BedRepositoryErrorAddingBed] = "An error occurred while adding this bed for the current hotel.";
ThMessage[ThStatusCode.BedRepositoryNameAlreadyExists] = "The name of the bed already exists.";
ThMessage[ThStatusCode.BedRepositoryErrorUpdatingBed] = "Problem updating the bed. It is possible that someone else changed it at the same time. Please refresh the page and try again.";
ThMessage[ThStatusCode.BedItemUpdateStrategyErrorUpdating] = "Error updating the bed.";
ThMessage[ThStatusCode.SaveBedItemError] = "Error saving the bed item.";
ThMessage[ThStatusCode.SaveBedItemInvalidBedTemplateId] = "Invalid bed template id.";
ThMessage[ThStatusCode.DeleteBedItemErrorDeleting] = "Error deleting bed item.";
ThMessage[ThStatusCode.DeleteBedItemErrorValidating] = "Error validating the existing bed item.";
ThMessage[ThStatusCode.BedControllerErrorGettingBeds] = "Error getting the beds.";
ThMessage[ThStatusCode.BedControllerErrorSavingBed] = "Error saving bed.";
ThMessage[ThStatusCode.BedControllerErrorDeletingBed] = "Error deleting bed.";
ThMessage[ThStatusCode.BedControllerErrorGettingBedById] = "Error getting bed by id.";
ThMessage[ThStatusCode.RoomRepositoryErrorGettingRoomList] = "Error getting the room list. Please try again.";
ThMessage[ThStatusCode.RoomRepositoryErrorGettingRoom] = "Error getting the room. Please try again.";
ThMessage[ThStatusCode.RoomRepositoryErrorReadingCategoryIdList] = "Error reading category list for defined rooms.";
ThMessage[ThStatusCode.RoomCategoryRepositoryErrorGettingRoomCategoryList] = "Error getting the room category list. Please try again.";
ThMessage[ThStatusCode.RoomCategoryRepositoryErrorGettingRoomCategory] = "Error getting the room category. Please try again.";
ThMessage[ThStatusCode.RoomCategoryRepositoryNameAlreadyExists] = "The room category you entered already exists.";
ThMessage[ThStatusCode.RoomCategoryRepositoryErrorAddingRoomCategory] = "Error creating room category.";
ThMessage[ThStatusCode.SaveRoomCategoryItemError] = "Error saving room category.";
ThMessage[ThStatusCode.DeleteRoomCategoryItemError] = "Error deleting room category.";
ThMessage[ThStatusCode.RoomCategoryItemUpdateStrategyErrorUpdating] = "Error updating room category id.";
ThMessage[ThStatusCode.HotelUpdatePaymentsPoliciesErrorPrecheckingConstraints] = "There was a problem while checking the payments and policies submitted.";
ThMessage[ThStatusCode.HotelUpdatePaymentPoliciesInvalidTaxes] = "Invalid taxes sent.";
ThMessage[ThStatusCode.HotelUpdatePaymentsPoliciesError] = "Error adding the payments and policies.";
ThMessage[ThStatusCode.HotelUpdatePaymentPoliciesInvalidCurrencyCode] = "Invalid currency code.";
ThMessage[ThStatusCode.HotelSaveTaxItemError] = "Error saving the tax item.";
ThMessage[ThStatusCode.HotelSaveTaxItemValidationProblem] = "Error validating the tax.";
ThMessage[ThStatusCode.TaxItemUpdateStrategyErrorUpdating] = "Error updating the tax.";
ThMessage[ThStatusCode.HotelUpdatePropertyDetailsUpdateError] = "Error updating the property details. Please try again.";
ThMessage[ThStatusCode.HotelUpdatePropertyDetailsValidationError] = "Error validating the property details. Please try again.";
ThMessage[ThStatusCode.HotelUpdatePropertyDetailsInvalidAmenityIdList] = "Invalid amenity list.";
ThMessage[ThStatusCode.HotelUpdatePropertyDetailsInvalidOperationHours] = "Invalid operation hours.";
ThMessage[ThStatusCode.HotelUpdatePropertyDetailsInvalidTimezone] = "Invalid timezone.";
ThMessage[ThStatusCode.HotelDetailsControllerErrorUpdatingPropertyDetails] = "Error updating property details.";
ThMessage[ThStatusCode.TaxRepositoryErrorGettingTaxList] = "Error getting the tax list. Please try again.";
ThMessage[ThStatusCode.TaxRepositoryErrorGettingTax] = "Error getting the tax. Please try again.";
ThMessage[ThStatusCode.TaxRepositoryNameAlreadyExists] = "The name of the tax already exists.";
ThMessage[ThStatusCode.TaxRepositoryErrorAddingTax] = "Error adding tax.";
ThMessage[ThStatusCode.TaxRepositoryProblemUpdatingTax] = "Problem updating the tax. It is possible that someone else changed it at the same time. Please refresh the page and try again.";
ThMessage[ThStatusCode.TaxRepositoryErrorUpdatingTax] = "Error updating tax.";
ThMessage[ThStatusCode.TaxRepositoryTaxNotFound] = "Tax not found.";
ThMessage[ThStatusCode.HotelDeleteTaxItemError] = "Error deleting tax item.";
ThMessage[ThStatusCode.HotelDeleteTaxItemErrorDeleting] = "Error deleting tax item.";
ThMessage[ThStatusCode.HotelDeleteTaxItemErrorValidating] = "Error validating the existing tax item.";
ThMessage[ThStatusCode.TaxControllerErrorGettingTaxes] = "Error getting the taxes.";
ThMessage[ThStatusCode.TaxControllerErrorSavingTax] = "Error saving tax.";
ThMessage[ThStatusCode.TaxControllerErrorDeletingTax] = "Error deleting tax.";
ThMessage[ThStatusCode.AddOnProductRepositoryProblemUpdatingAddOnProduct] = "Problem updating the add on product. It is possible that someone else changed it at the same time. Please refresh the page and try again.";
ThMessage[ThStatusCode.AddOnProductRepositoryErrorUpdatingAddOnProduct] = "Error updating add on product.";
ThMessage[ThStatusCode.AddOnProductRepositoryNameAlreadyExists] = "The add on product name you entered already exists.";
ThMessage[ThStatusCode.AddOnProductRepositoryErrorAddingAddOnProduct] = "Error creating add on product.";
ThMessage[ThStatusCode.AddOnProductRepositoryProductNotFound] = "Add on product not found.";
ThMessage[ThStatusCode.AddOnProductRepositoryErrorGettingAddOnProduct] = "Error getting add on product.";
ThMessage[ThStatusCode.AddOnProductRepositoryErrorReadingCategoryIdList] = "Error reading category list for defined add on products.";
ThMessage[ThStatusCode.AddOnProductRepositoryErrorReadingDocumentCount] = "Error getting document count.";
ThMessage[ThStatusCode.AddOnProductRepositoryErrorGettingList] = "Error getting add on products.";
ThMessage[ThStatusCode.SaveAddOnProductItemError] = "Error saving add on product.";
ThMessage[ThStatusCode.SaveAddOnProductItemInvalidCategoryId] = "Invalid category id.";
ThMessage[ThStatusCode.SaveAddOnProductItemInvalidTaxId] = "Invalid tax id.";
ThMessage[ThStatusCode.AddOnProductItemUpdateStrategyErrorUpdating] = "Error updating add on product id.";
ThMessage[ThStatusCode.DeleteAddOnProductItemError] = "Error deleting add on product.";
ThMessage[ThStatusCode.DeleteAddOnProductItemErrorValidating] = "Error validating add on product.";
ThMessage[ThStatusCode.AddOnProductsControllerErrorGettingAddOnProduct] = "Error getting add on product.";
ThMessage[ThStatusCode.AddOnProductsControllerErrorSavingAddOnProduct] = "Error saving add on product.";
ThMessage[ThStatusCode.AddOnProductsControllerErrorDeletingAddOnProduct] = "Error deleting add on product.";
ThMessage[ThStatusCode.AddOnProductsControllerErrorGettingCategoryIdList] = "Error getting the categories for your add on products.";
ThMessage[ThStatusCode.AddOnProductsControllerErrorGettingCount] = "Error getting the number of add on products.";
ThMessage[ThStatusCode.AddOnProductsControllerErrorGettingList] = "Error getting the list of add on products.";
ThMessage[ThStatusCode.CustomerRepositoryCustomerNotFound] = "The customer was not found.";
ThMessage[ThStatusCode.CustomerRepositoryErrorGettingCustomer] = "Error getting customer.";
ThMessage[ThStatusCode.CustomerRepositoryErrorCreatingCustomer] = "Error creating customer.";
ThMessage[ThStatusCode.CustomerRepositoryProblemUpdatingCustomer] = "Problem updating the customer. It is possible that someone else changed it at the same time. Please refresh the page and try again.";
ThMessage[ThStatusCode.CustomerRepositoryErrorUpdatingCustomer] = "Error updating the customer.";
ThMessage[ThStatusCode.CustomerRepositoryErrorReadingCustomerCount] = "Error getting the number of customers.";
ThMessage[ThStatusCode.CustomerRepositoryErrorGettingList] = "Error getting customers.";
ThMessage[ThStatusCode.SaveCustomerItemError] = "Error saving customer.";
ThMessage[ThStatusCode.SaveCustomerItemInvalidOrNullClientType] = "Invalid client type.";
ThMessage[ThStatusCode.SaveCustomerItemCompOrTACannotBeLinkedToOtherCustomers] = "Companies or travel agencies cannot be linked to other customers.";
ThMessage[ThStatusCode.SaveCustomerItemCannotSetPriceProductsForPublic] = "Cannot set specific price products for this client unless private is selected.";
ThMessage[ThStatusCode.SaveCustomerItemInvalidPriceProductIdList] = "Some of the selected price products could not be found.";
ThMessage[ThStatusCode.CustomerItemUpdateStrategyError] = "Error updating customer.";
ThMessage[ThStatusCode.CustomersControllerErrorGettingCustomer] = "Error getting customer.";
ThMessage[ThStatusCode.CustomersControllerErrorSavingCustomer] = "Error saving customer.";
ThMessage[ThStatusCode.CustomersControllerErrorGettingCount] = "Error getting the number of customers.";
ThMessage[ThStatusCode.CustomersControllerErrorGettingList] = "Error getting the list of customers.";

export class ThResponse {
	statusCode: ThStatusCode;
	message: string;
	data: any;

	constructor(statusCode: ThStatusCode, data?: any) {
		this.statusCode = statusCode;
		this.message = ThMessage[statusCode];
		this.data = data;
		if (!this.data) {
			this.data = {};
		}
	}

	public buildJson(locale: Locales): Object {
		var thUtils = new ThUtils();
		if (!thUtils.isUndefinedOrNull(locale)) {
			this.translateMessage(locale);
		}
		return this;
	}
	private translateMessage(locale: Locales) {
		var translation = new Translation(locale);
		this.message = translation.getTranslation(this.message);
	}
}