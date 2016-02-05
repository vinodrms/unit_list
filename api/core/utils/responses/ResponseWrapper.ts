import {Locales, Translation} from '../localization/Translation';

export enum ResponseStatusCode {
	Ok,
	InvalidRequestParameters,
	VatProviderErrorCheckingVat,
	VatProviderNotInEu,
	VatProviderInvalidVat,
	EmailTemplateBuilderProblemFindingTemplatesDirectory,
	EmailTemplateBuilderProblemBuildingContent,
	SmtpEmailSenderErrorSendingEmail,
	HotelSignUpError,
	HotelRepositoryErrorAddingHotel
}

var ResponseMessage: { [index: number]: string; } = {};
ResponseMessage[ResponseStatusCode.Ok] = "Ok";
ResponseMessage[ResponseStatusCode.InvalidRequestParameters] = "Invalid Request Parameters";
ResponseMessage[ResponseStatusCode.VatProviderErrorCheckingVat] = "Problem checking the VAT";
ResponseMessage[ResponseStatusCode.VatProviderNotInEu] = "The VAT is not in EU";
ResponseMessage[ResponseStatusCode.VatProviderInvalidVat] = "Invalid VAT format";
ResponseMessage[ResponseStatusCode.EmailTemplateBuilderProblemFindingTemplatesDirectory] = "Error sending email: the content was not found on the server. Please contact the Administrator.";
ResponseMessage[ResponseStatusCode.EmailTemplateBuilderProblemBuildingContent] = "Error sending email: problem building content. Please contact the Administrator.";
ResponseMessage[ResponseStatusCode.SmtpEmailSenderErrorSendingEmail] = "Error sending email. Please contact the Administrator.";
ResponseMessage[ResponseStatusCode.HotelSignUpError] = "Error signing up. Please try again.";
ResponseMessage[ResponseStatusCode.HotelRepositoryErrorAddingHotel] = "Error adding the information. Please try again.";

export class ResponseWrapper {
	statusCode : ResponseStatusCode;
	message : string;
	data : any;
	
	constructor(statusCode : ResponseStatusCode, data? : any) {
		this.statusCode = statusCode;
		this.message = ResponseMessage[statusCode];
		this.data = data;
		if(!this.data) {
			this.data = {};
		}
	}
	
	public buildResponse(locale : Locales) : Object {
		if(! _.isUndefined(locale)) {
			this.translateMessage(locale);	
		}
		return this;
	}
	private translateMessage(locale : Locales) {
		var translation = new Translation(locale);
		this.message = translation.getTranslation(this.message);
	}
}