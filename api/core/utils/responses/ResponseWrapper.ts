import {Locales, Translation} from '../localization/Translation';

export enum ErrorCode {
	Ok,
	InternalServerError,
	InvalidRequestParameters,
	VatProviderErrorCheckingVat,
	VatProviderNotInEu,
	VatProviderInvalidVat,
	EmailTemplateBuilderProblemFindingTemplatesDirectory,
	EmailTemplateBuilderProblemBuildingContent,
	SmtpEmailServiceErrorSendingEmail,
	HotelSignUpError,
	HotelRepositoryAccountAlreadyExists,
	HotelRepositoryErrorAddingHotel,
	HotelLoginError,
	HotelRepositoryErrorFindingAccount,
	HotelRepositoryAccountNotFound,
	HotelAuthenticationAccountNotActive,
	HotelAuthenticationInvalidEmailOrPassword,
	HotelRepositoryErrorActivatingAccount,
	HotelRepositoryAccountCouldNotBeActivated,
	HotelActivateError,
	AccControllerErrorInitializingSession,
	HotelRepositoryProblemUpdatingPasswordToken,
	HotelRepositoryErrorUpdatingPasswordToken,
	UserAccountRequestResetPasswordError,
	AccControllerErrorRequestingResetPassword,
	HotelRepositoryCountNotResetPassword,
	HotelRepositoryErrorCouldNotResetPassword,
	UserAccountResetPasswordError,
	AccControllerErrorResettingPassword,

	NUM_OF_ITEMS
}

var ErrorMessage: { [index: number]: string; } = {};
ErrorMessage[ErrorCode.Ok] = "Ok";
ErrorMessage[ErrorCode.InternalServerError] = "Internal Server Error.";
ErrorMessage[ErrorCode.InvalidRequestParameters] = "Invalid Request Parameters";
ErrorMessage[ErrorCode.VatProviderErrorCheckingVat] = "Problem checking the VAT";
ErrorMessage[ErrorCode.VatProviderNotInEu] = "The VAT is not in EU";
ErrorMessage[ErrorCode.VatProviderInvalidVat] = "Invalid VAT format";
ErrorMessage[ErrorCode.EmailTemplateBuilderProblemFindingTemplatesDirectory] = "Error sending email: the content was not found on the server. Please contact the Administrator.";
ErrorMessage[ErrorCode.EmailTemplateBuilderProblemBuildingContent] = "Error sending email: problem building content. Please contact the Administrator.";
ErrorMessage[ErrorCode.SmtpEmailServiceErrorSendingEmail] = "Error sending email. Please contact the Administrator.";
ErrorMessage[ErrorCode.HotelSignUpError] = "Error signing up. Please try again.";
ErrorMessage[ErrorCode.HotelRepositoryAccountAlreadyExists] = "An account with this email already exists.";
ErrorMessage[ErrorCode.HotelRepositoryErrorAddingHotel] = "Error adding the information. Please try again.";
ErrorMessage[ErrorCode.HotelLoginError] = "Error signing in. Please try again.";
ErrorMessage[ErrorCode.HotelRepositoryErrorFindingAccount] = "Error finding account. Please try again.";
ErrorMessage[ErrorCode.HotelRepositoryAccountNotFound] = "Invalid email or password.";
ErrorMessage[ErrorCode.HotelAuthenticationAccountNotActive] = "The account is not active.";
ErrorMessage[ErrorCode.HotelAuthenticationInvalidEmailOrPassword] = "Invalid email or password.";
ErrorMessage[ErrorCode.HotelRepositoryErrorActivatingAccount] = "There was a problem while activating your account.";
ErrorMessage[ErrorCode.HotelRepositoryAccountCouldNotBeActivated] = "The account could not be activated.";
ErrorMessage[ErrorCode.HotelActivateError] = "There was a problem while activating your account.";
ErrorMessage[ErrorCode.AccControllerErrorInitializingSession] = "There was a problem while creating your session. Please try again.";
ErrorMessage[ErrorCode.HotelRepositoryProblemUpdatingPasswordToken] = "The password could not be reset. Please check the email and try again.";
ErrorMessage[ErrorCode.HotelRepositoryErrorUpdatingPasswordToken] = "There was a problem while resetting the password.";
ErrorMessage[ErrorCode.UserAccountRequestResetPasswordError] = "There was a problem while resetting the password. Please contract the administrator if this problem persists.";
ErrorMessage[ErrorCode.AccControllerErrorRequestingResetPassword] = "Problem resetting your password.";
ErrorMessage[ErrorCode.HotelRepositoryCountNotResetPassword] = "Problem while updating the new password. The link you used may expired.";
ErrorMessage[ErrorCode.HotelRepositoryErrorCouldNotResetPassword] = "Problem while updating the new password.";
ErrorMessage[ErrorCode.UserAccountResetPasswordError] = "There was a problem while changing the password. Please contract the administrator if this problem persists.";
ErrorMessage[ErrorCode.AccControllerErrorResettingPassword] = "There was a problem while changing the password.";


export class ErrorContainer {
	public error: Error;
	public code: ErrorCode;
	constructor(code: ErrorCode, error?: Error) {
		this.code = code;
		this.error = error;
		if (!this.error) {
			this.error = new Error();
		}
	}
}

export class ResponseWrapper {
	statusCode: ErrorCode;
	message: string;
	data: any;

	constructor(statusCode: ErrorCode, data?: any) {
		this.statusCode = statusCode;
		this.message = ErrorMessage[statusCode];
		this.data = data;
		if (!this.data) {
			this.data = {};
		}
	}

	public buildJson(locale: Locales): Object {
		if (!_.isUndefined(locale)) {
			this.translateMessage(locale);
		}
		return this;
	}
	private translateMessage(locale: Locales) {
		var translation = new Translation(locale);
		this.message = translation.getTranslation(this.message);
	}
}