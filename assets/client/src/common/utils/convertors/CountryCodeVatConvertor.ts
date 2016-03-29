export class CountryCodeVatConvertor {
	constructor() {
	}
	public convertCountryCode(countryCode: string): string {
		if (countryCode === 'GR') {
			return 'EL';
		}
		return countryCode;
	}
	public getFullVat(countryCode: string, vatNumber: string): string {
		return this.convertCountryCode(countryCode) + vatNumber;
	}
}