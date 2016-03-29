import {IVatProvider, VatDetailsDO} from './IVatProvider';
import {ThLogger, ThLogLevel} from '../../utils/logging/ThLogger';
import {ThError} from '../../utils/th-responses/ThError';
import {ThStatusCode} from '../../utils/th-responses/ThResponse';
import {VatNumberValidationRule} from '../../utils/th-validation/rules/VatNumberValidationRule';
import {ValidationResult, InvalidConstraintType} from '../../utils/th-validation/rules/core/ValidationResult';
import {AppContext} from '../../utils/AppContext';
import {ThUtils} from '../../utils/ThUtils';
import {UnitPalConfig} from '../../utils/environment/UnitPalConfig';
import {CountryDO} from '../../data-layer/common/data-objects/country/CountryDO';
import {VatProviderFactory} from './VatProviderFactory';

import _ = require('underscore');

export class VatProviderProxyService implements IVatProvider {

    private _appContext: AppContext;
    private _vatProviderFactory: VatProviderFactory;
    private _thUtils: ThUtils;
    private _countryCode: string;
    private _vat: string;

    constructor(private _unitPalConfig: UnitPalConfig) {
        this._appContext = new AppContext(_unitPalConfig);
        this._vatProviderFactory = new VatProviderFactory;
        this._thUtils = new ThUtils();
    }

    public checkVAT(countryCode: string, vat: string): Promise<VatDetailsDO> {
        this._countryCode = countryCode;
        this._vat = vat;

        return new Promise<VatDetailsDO>((resolve, reject) => {
            this.checkVATCore(resolve, reject);
        });
    }

    private validVatNumber(): boolean {
        var vatNumberValidationRule = new VatNumberValidationRule();
        return vatNumberValidationRule.validate(this._vat).isValid();
    }

    private checkVATCore(resolve: { (result: VatDetailsDO): void }, reject: { (err: ThError): void }) {
        if (!this.validVatNumber()) {
            process.nextTick(() => {
                var thError = new ThError(ThStatusCode.VatProviderInvalidVat, null);
                reject(thError);
                return;
            });
        }
		this.euMember(this._countryCode)
			.then((euMember: boolean) => {
				if (!euMember) {
					var thError = new ThError(ThStatusCode.VatProviderProxyServiceNonEuCountry, null);
					ThLogger.getInstance().logBusiness(ThLogLevel.Info, "Non EU Country", { countryCode: this._countryCode, vat: this._vat }, thError);
					throw thError;
				}
				else {
					return new Promise<boolean>((resolve: { (result: boolean): void }, reject: { (err: ThError): void }) => { resolve(true); });
				}
			})
			.then((isEuResult: boolean) => {
				return this._vatProviderFactory.getEUVatProvider().checkVAT(this._countryCode, this._vat);
			})
			.then((companyDetails: VatDetailsDO) => {
				resolve(companyDetails);
			})
			.catch((err: any) => {
				var thError = new ThError(ThStatusCode.VatProviderErrorCheckingVat, err);
				reject(thError);
			});
    }

    private euMember(countryCode: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.euMemberCore(resolve, reject, countryCode);
        });
    }
    private euMemberCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }, countryCode: string) {
		var settingsRepo = this._appContext.getRepositoryFactory().getSettingsRepository();
		settingsRepo.getCountries({ code: countryCode })
			.then((countryList: CountryDO[]) => {
				if (_.isEmpty(countryList)) {
					var thError = new ThError(ThStatusCode.VatProviderInvalidCountryCode, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Info, "Error retrieving country from system settings.", { countryCode: countryCode }, thError);
                    reject(thError);
					return;
                }
				if (this._thUtils.isUndefinedOrNull(countryList[0].inEU)) {
                    resolve(false);
                }
				resolve(countryList[0].inEU);
			}).catch((err: any) => {
				var thError = new ThError(ThStatusCode.VatProviderInvalidCountryCode, null);
				ThLogger.getInstance().logBusiness(ThLogLevel.Info, "Error retrieving country from system settings.", { countryCode: countryCode }, thError);
				reject(thError);
			});
    }
}