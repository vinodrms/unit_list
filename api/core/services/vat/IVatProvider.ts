export class VatDetailsDO {
	public fullVatNumber: string;

	constructor(public countryCode: string,
		public vatNumber: string,
		public companyName: string,
		public companyAddress: string) {
		this.fullVatNumber = this.countryCode + this.vatNumber;
		var newLineRegex: any = /\r?\n|\r/g;
		this.companyAddress = this.companyAddress.replace(new RegExp(newLineRegex), ' ').trim();
	}
}

export interface IVatProvider {
	checkVAT(countryCode: string, vat: string): Promise<VatDetailsDO>;
}