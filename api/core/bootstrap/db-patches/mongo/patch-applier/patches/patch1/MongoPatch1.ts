import {MongoPatcheType, AMongoPatch} from '../../utils/AMongoPatch';
import {ThLogger, ThLogLevel} from '../../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../../utils/th-responses/ThResponse';
import {Amenities} from './data-sets/Amenities';
import {Countries} from './data-sets/Countries';
import {CurrencyCodes} from './data-sets/CurrencyCodes';
import {PaymentMethods} from './data-sets/PaymentMethods';
import {ThUtils} from '../../../../../../utils/ThUtils';
import {BaseMongoRepository} from '../../../../../../data-layer/common/base/BaseMongoRepository';
import {SettingsMongoRepository} from '../../../../../../data-layer/settings/repositories/mongo/SettingsMongoRepository';

import async = require('async');

export class MongoPatch1 extends AMongoPatch {
    private _thUtils: ThUtils;
    private _settingsEntity: Sails.Model;
    private _mongoSettingsRepository: SettingsMongoRepository;

    constructor() {
        super();
        this._thUtils = new ThUtils();
        this._settingsEntity = sails.models.settingsentity;
        this._mongoSettingsRepository = new SettingsMongoRepository();
    }
    public getPatchType(): MongoPatcheType {
        return MongoPatcheType.PopulateCountriesAndCurrencyCodes;
    }
    public apply(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.applyCore(resolve, reject);
        });
    }

    private applyCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
        var thUtils: ThUtils = new ThUtils();

        async.waterfall(
            [
                ((finishedEnsuringIndex: { (error: ThError, result?: boolean): void }) => {
                    BaseMongoRepository.getNativeMongoCollectionForSailsEntity(this._settingsEntity).then((nativeCollection: any) => {
                        nativeCollection.ensureIndex("metadata.type", { unique: true }, ((err, indexName) => {
                            if (err || !indexName) {
                                var thError = new ThError(ThStatusCode.MongoPatchErrorEnsuringUniqueIndexOnSettings, err);
                                ThLogger.getInstance().logError(ThLogLevel.Error, "AMongoDBPatch1 - ensuring metadata.type index on native settings patches collection", { step: "Bootstrap" }, thError);
                                finishedEnsuringIndex(thError);
                                return;
                            }
                            finishedEnsuringIndex(null, true);
                        }));
                    }).catch((error: any) => {
                        finishedEnsuringIndex(error);
                    });
                }),
                ((previousResult: boolean, finishedPopulatingAmenitiesCallback: any) => {
                    var amenities = new Amenities();
                    var amenitySettings = amenities.getAmenitySettingDO();
                    this.addSettingAsync(amenitySettings, finishedPopulatingAmenitiesCallback);
                }),
                ((previousResult: boolean, finishedPopulatingCountriesCallback: any) => {
                    var countries = new Countries();
                    var countrySettings = countries.getCountrySettingDO();
                    this.addSettingAsync(countrySettings, finishedPopulatingCountriesCallback);
                }),
                ((previousResult: boolean, finishedPopulatingCurrenciesCallback: any) => {
                    var ccies = new CurrencyCodes();
                    var ccySettings = ccies.getCurrencySettingDO();
                    this.addSettingAsync(ccySettings, finishedPopulatingCurrenciesCallback);
                }),
                ((previousResult: boolean, finishedPopulatingPaymentMethodsCallback: any) => {
                    var pms = new PaymentMethods();
                    var pmSettings = pms.getPaymentMethodSettingDO();
                    this.addSettingAsync(pmSettings, finishedPopulatingPaymentMethodsCallback);
                })
            ],
            ((err: Error) => {
                if (err) {
                    var thError = new ThError(ThStatusCode.ErrorBootstrappingApp, err);
                    reject(thError);
                }
                else {
                    resolve(true);
                }
            })
        );
    }

    private addSettingAsync(setting: Object, finishAddCallback: { (err: any, result?: boolean): void; }) {
        this._mongoSettingsRepository.addSettings(setting).then((result: boolean) => {
            finishAddCallback(null, result);
        }).catch((error: any) => {
            finishAddCallback(error);
        });
    }

}