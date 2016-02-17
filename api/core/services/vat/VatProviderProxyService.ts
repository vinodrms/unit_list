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
import async = require('async');

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
        async.waterfall(
            [
                ((finishedEUMemberCheck: { (error: ThError, result?: boolean): void }) => {
                    this.euMemberAsync(this._countryCode, finishedEUMemberCheck);
                }),
                ((euMember: boolean, finishedVatNumberCheckCallback: any) => {
                    if (!euMember) {
                        finishedVatNumberCheckCallback(null, new VatDetailsDO(this._countryCode, this._vat, '', ''));
                    }
                    else {
                        this.checkEUVatNumberAsync(this._countryCode, this._vat, finishedVatNumberCheckCallback);
                    }
                })
            ],
            ((err: Error, result: VatDetailsDO) => {
                if (err) {
                    var thError = new ThError(ThStatusCode.VatProviderErrorCheckingVat, err);
                    reject(thError);
                }
                else {
                    resolve(result);
                }
            })
        );
    }

    private checkEUVatNumberAsync(countryCode: string, vatNumber: string, callback: { (err: any, companyDetails?: VatDetailsDO) }) {
        this._vatProviderFactory.getEUVatProvider().checkVAT(countryCode, vatNumber).then((companyDetails: VatDetailsDO) => {
            callback(null, companyDetails);
        }).catch((error: any) => {
            callback(error);
        });
    }

    private euMemberAsync(countryCode: string, callback: { (err: any, euMember?: boolean): void }) {
        this.euMember(countryCode).then((euMember: boolean) => {
            callback(null, euMember);
        }).catch((error: any) => {
            callback(error);
        });
    }

    private euMember(countryCode: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.euMemberCore(resolve, reject, countryCode);
        });
    }

    private euMemberCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }, countryCode: string) {
        this._appContext.getRepositoryFactory().getSettingsRepository().getCountriesAsync(
            (error: any, country: CountryDO[]) => {
                if (error || _.isEmpty(country)) {
                    var thError = new ThError(ThStatusCode.VatProviderInvalidCountryCode, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Info, "Error retrieving country from system settings.", { countryCode: countryCode }, thError);
                    reject(thError);
                    return;
                }
                if (this._thUtils.isUndefinedOrNull(country[0].inEU)) {
                    resolve(false);
                }
                else {
                    resolve(country[0].inEU);
                }
            },
            { code: countryCode });
    }
}