import {VatDetailsDO} from '../VatDetailsDO';
import {IVatProvider} from '../IVatProvider';

import {ResponseWrapper, ResponseStatusCode} from '../../../utils/responses/ResponseWrapper';

export class VIESVatAdapter implements IVatProvider {
	private static EcEuropaWsdl = 'http://ec.europa.eu/taxation_customs/vies/checkVatService.wsdl';

	private _countryCode: string;
	private _vat: string;

	public checkVAT(countryCode: string, vat: string): Promise<VatDetailsDO> {
		this._countryCode = countryCode;
		this._vat = vat;
		return new Promise<VatDetailsDO>((resolve, reject) => {
			try {
				this.checkVATFromPromise(resolve, reject);
			} catch (e) {
				reject(new ResponseWrapper(ResponseStatusCode.VatProviderErrorCheckingVat));
			}
		});
	}
	private checkVATFromPromise(resolve, reject) {
		var soap = require('soap');
		var args = { countryCode: this._countryCode, vatNumber: this._vat };

		soap.createClient(VIESVatAdapter.EcEuropaWsdl, (err, client) => {
			client.checkVat(args, function(err, result) {
				if (err && !result) {
					reject(new ResponseWrapper(ResponseStatusCode.VatProviderErrorCheckingVat));
				}
				else {
					if (!result.valid) {
						reject(new ResponseWrapper(ResponseStatusCode.VatProviderInvalidVat));
					}
					else {
						var vatDetails : VatDetailsDO = new VatDetailsDO(result.countryCode, result.vatNumber, result.name, result.address);
						resolve(vatDetails);
					}
				}
			}, {timeout: 5000});
		});
	}
}