import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {ThUtils} from '../../../utils/ThUtils';
import {IVatProvider, VatDetailsDO} from '../IVatProvider';

var soap = require('soap');

export class VIESVatProviderAdapter implements IVatProvider {
    private static TimeoutMillis = 5000;
    private static EcEuropaWsdl = 'http://ec.europa.eu/taxation_customs/vies/checkVatService.wsdl';

    private _countryCode: string;
    private _vat: string;

    public checkVAT(countryCode: string, vat: string): Promise<VatDetailsDO> {
        this._countryCode = countryCode;
        this._vat = vat;

        return new Promise<VatDetailsDO>((resolve: { (result: VatDetailsDO): void }, reject: { (err: ThError): void }) => {
            try {
                this.checkVATCore(resolve, reject);
            } catch (e) {
                var thError = new ThError(ThStatusCode.VatProviderErrorCheckingVat, e);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Error running VIES SOAP Service", { countryCode: countryCode, vat: vat }, thError);
                reject(thError);
            }
        });
    }
    private checkVATCore(resolve: { (result: VatDetailsDO): void }, reject: { (err: ThError): void }) {
        var args = { countryCode: this._countryCode, vatNumber: this._vat };

        soap.createClient(VIESVatProviderAdapter.EcEuropaWsdl, (err, client) => {
            var thUtils = new ThUtils();
            if (thUtils.isUndefinedOrNull(client) || (thUtils.isUndefinedOrNull(client.checkVat))) {
                var thError = new ThError(ThStatusCode.VatProviderErrorCheckingVat, err);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Error checking VAT", args, thError);
                reject(thError);
                return;
            }
            client.checkVat(args, function(err: Error, result) {
                if (err && !result) {
                    var thError = new ThError(ThStatusCode.VatProviderErrorCheckingVat, err);
                    ThLogger.getInstance().logError(ThLogLevel.Error, "Error checking VAT", args, thError);
                    reject(thError);
                }
                else {
                    if (!result.valid) {
                        var thError = new ThError(ThStatusCode.VatProviderInvalidVat, null);
                        ThLogger.getInstance().logBusiness(ThLogLevel.Info, "Invalid VAT", args, thError);
                        reject(thError);
                    }
                    else {
                        var vatDetails: VatDetailsDO = new VatDetailsDO(result.countryCode, result.vatNumber, result.name, result.address);
                        resolve(vatDetails);
                    }
                }
            }, { timeout: VIESVatProviderAdapter.TimeoutMillis });
        });
    }
}