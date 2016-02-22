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
    SettingsMongoRepositoryAddDuplicateKeyError,
    SettingsMongoRepositoryAddError,
    SettingsMongoRepositoryReadError,
    MongoRepositoryGetNetiveEntityError,
    MongoPatchErrorEnsuringUniqueIndexOnSettings,
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
	HotelAddPaymentPoliciesHotelAlreadyConfigured,
	PaymentMethodIdListValidatorInvalid,
	PaymentMethodIdListValidatorError,
	HotelAddPaymentsPoliciesErrorPrecheckingConstraints,
	HotelAddPaymentPoliciesInvalidTaxes,
	HotelAddPaymentsPoliciesError,
	HotelAddPaymentPoliciesInvalidCurrencyCode,
	HotelSaveTaxItemError,
	ATaxItemActionStrategyInvalidTaxItemType,
	ATaxItemActionStrategyErrorValidating,
	HotelUpdatePropertyDetailsUpdateError,
	HotelUpdatePropertyDetailsValidationError,
	HotelUpdatePropertyDetailsInvalidAmenityIdList,
	HotelUpdatePropertyDetailsInvalidOperationHours,
	HotelUpdatePropertyDetailsInvalidTimezone,
	HotelDetailsControllerErrorUpdatingPropertyDetails
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
ThMessage[ThStatusCode.SettingsMongoRepositoryAddDuplicateKeyError] = "Error inserting setting (duplicate key error).";
ThMessage[ThStatusCode.SettingsMongoRepositoryAddError] = "Error inserting setting.";
ThMessage[ThStatusCode.SettingsMongoRepositoryReadError] = "Error reading system setting.";
ThMessage[ThStatusCode.MongoRepositoryGetNetiveEntityError] = "Error getting native entity for collection.";
ThMessage[ThStatusCode.MongoPatchErrorEnsuringUniqueIndexOnSettings] = "Error ensuring unique index on settings collection.";
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
ThMessage[ThStatusCode.HotelAddPaymentPoliciesHotelAlreadyConfigured] = "You can't change the payments and policies for your hotel because you finished the wizard. You can only edit them or add new ones.";
ThMessage[ThStatusCode.PaymentMethodIdListValidatorInvalid] = "Invalid payment methods submitted.";
ThMessage[ThStatusCode.PaymentMethodIdListValidatorError] = "Error validating payment method id list.";
ThMessage[ThStatusCode.HotelAddPaymentsPoliciesErrorPrecheckingConstraints] = "There was a problem while checking the payments and policies submitted.";
ThMessage[ThStatusCode.HotelAddPaymentPoliciesInvalidTaxes] = "Invalid taxes sent.";
ThMessage[ThStatusCode.HotelAddPaymentsPoliciesError] = "Error adding the payments and policies.";
ThMessage[ThStatusCode.HotelAddPaymentPoliciesInvalidCurrencyCode] = "Invalid currency code.";
ThMessage[ThStatusCode.HotelSaveTaxItemError] = "Error saving the tax item.";
ThMessage[ThStatusCode.ATaxItemActionStrategyErrorValidating] = "Error validating the tax item.";
ThMessage[ThStatusCode.ATaxItemActionStrategyInvalidTaxItemType] = "Invalid tax item type sent to server.";
ThMessage[ThStatusCode.HotelUpdatePropertyDetailsUpdateError] = "Error updating the property details. Please try again.";
ThMessage[ThStatusCode.HotelUpdatePropertyDetailsValidationError] = "Error validating the property details. Please try again.";
ThMessage[ThStatusCode.HotelUpdatePropertyDetailsInvalidAmenityIdList] = "Invalid amenity list.";
ThMessage[ThStatusCode.HotelUpdatePropertyDetailsInvalidOperationHours] = "Invalid operation hours.";
ThMessage[ThStatusCode.HotelUpdatePropertyDetailsInvalidTimezone] = "Invalid timezone.";
ThMessage[ThStatusCode.HotelDetailsControllerErrorUpdatingPropertyDetails] = "Error updating property details.";

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