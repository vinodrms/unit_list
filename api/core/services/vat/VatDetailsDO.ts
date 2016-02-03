export class VatDetailsDO {
	private _fullVatNumber : string;
	
	constructor(private _countryCode : string, private _vatNumber : string, private _companyName : string, private _companyAddress : string) {
		this._fullVatNumber = this._countryCode + this._vatNumber;
		var newLineRegex : any = /\r?\n|\r/g;
		this._companyAddress = this._companyAddress.replace(new RegExp(newLineRegex), ' ').trim();
	}
	
	public getCountryCode() : string {
		return this._countryCode;
	}
	public getVatNumber() : string {
		return this._vatNumber;
	}
	public getFullVatNumber() : string {
		return this._fullVatNumber;
	}
	public getCompanyName() : string {
		return this._companyName;
	}
	public getCompanyAddress() : string {
		return this._companyAddress;
	}
}