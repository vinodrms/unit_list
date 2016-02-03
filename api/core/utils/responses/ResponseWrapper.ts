import {Locales, Translation} from '../localization/Translation';

export enum ResponseStatusCode {
	Ok,
	VatProviderErrorCheckingVat,
	VatProviderNotInEu,
	VatProviderInvalidVat
}

var ResponseMessage: { [index: number]: string; } = {};
ResponseMessage[ResponseStatusCode.Ok] = "Ok";
ResponseMessage[ResponseStatusCode.VatProviderErrorCheckingVat] = "Problem checking the VAT";
ResponseMessage[ResponseStatusCode.VatProviderNotInEu] = "The VAT is not in EU";
ResponseMessage[ResponseStatusCode.VatProviderInvalidVat] = "Invalid VAT format";

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
		this.translateMessage(locale);
		return this;
	}
	private translateMessage(locale : Locales) {
		var translation = new Translation(locale);
		this.message = translation.getTranslation(this.message);
	}
}