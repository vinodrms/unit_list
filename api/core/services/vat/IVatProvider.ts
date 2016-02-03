import {VatDetailsDO} from './VatDetailsDO';

export interface IVatProvider {
	checkVAT(countryCode : string, vat : string) : Promise<VatDetailsDO>;
}