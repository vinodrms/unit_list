import {VatDetailsDO} from '../VatDetailsDO';
import {IVatProvider} from '../IVatProvider';

import {ErrorContainer, ErrorCode} from '../../../utils/responses/ResponseWrapper';
import {Logger} from '../../../utils/logging/Logger';
var soap = require('soap');

export class VIESVatProviderAdapter implements IVatProvider {
	private static EcEuropaWsdl = 'http://ec.europa.eu/taxation_customs/vies/checkVatService.wsdl';

	private _countryCode: string;
	private _vat: string;

	public checkVAT(countryCode: string, vat: string): Promise<VatDetailsDO> {
		this._countryCode = countryCode;
		this._vat = vat;
		return new Promise<VatDetailsDO>((resolve, reject) => {
			try {
				this.checkVATCore(resolve, reject);
			} catch (e) {
				Logger.getInstance().logError("Error running VIES SOAP Service", { countryCode: countryCode, vat: vat }, e);
				reject(new ErrorContainer(ErrorCode.VatProviderErrorCheckingVat, e));
			}
		});
	}
	private checkVATCore(resolve, reject) {
		var args = { countryCode: this._countryCode, vatNumber: this._vat };

		soap.createClient(VIESVatProviderAdapter.EcEuropaWsdl, (err, client) => {
			client.checkVat(args, function(err, result) {
				if (err && !result) {
					Logger.getInstance().logBusiness("Error checking VAT", args, err);
					reject(new ErrorContainer(ErrorCode.VatProviderErrorCheckingVat));
				}
				else {
					if (!result.valid) {
						Logger.getInstance().logBusiness("Invalid VAT", args);
						reject(new ErrorContainer(ErrorCode.VatProviderInvalidVat));
					}
					else {
						var vatDetails: VatDetailsDO = new VatDetailsDO(result.countryCode, result.vatNumber, result.name, result.address);
						resolve(vatDetails);
					}
				}
			}, { timeout: 5000 });
		});
	}
}