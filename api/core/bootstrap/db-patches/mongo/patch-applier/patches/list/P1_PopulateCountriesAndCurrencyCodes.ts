import { ThLogger, ThLogLevel } from '../../../../../../utils/logging/ThLogger';
import { ThError } from '../../../../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../../../../utils/th-responses/ThResponse';
import { ATransactionalMongoPatch } from '../../utils/ATransactionalMongoPatch';
import { MongoPatchType } from '../MongoPatchType';
import { MongoRepository } from '../../../../../../data-layer/common/base/MongoRepository';
import { MongoSettingsRepository } from '../../../../../../data-layer/settings/repositories/mongo/MongoSettingsRepository';

import { RoomAmenities } from './P1_data-sets/amenities/RoomAmenities';
import { RoomAttributes } from './P1_data-sets/RoomAttributes';
import { HotelAmenities } from './P1_data-sets/amenities/HotelAmenities';
import { Countries } from './P1_data-sets/Countries';
import { CurrencyCodes } from './P1_data-sets/CurrencyCodes';
import { PaymentMethods } from './P1_data-sets/PaymentMethods';
import { BedTemplates } from './P1_data-sets/BedTemplates';
import { AddOnProductCategories } from './P1_data-sets/AddOnProductCategories';
import { YieldManagerFilters } from './P1_data-sets/YieldManagerFilters';

import async = require('async');

declare var sails: any;

export class P1_PopulateCountriesAndCurrencyCodes extends ATransactionalMongoPatch {
    private _settingsToAdd: Object[] = [
        (new RoomAmenities()).getAmenitySettingDO(),
        (new HotelAmenities()).getAmenitySettingDO(),
        (new Countries()).getCountrySettingDO(),
        (new CurrencyCodes()).getCurrencySettingDO(),
        (new PaymentMethods()).getPaymentMethodSettingDO(),
        (new BedTemplates()).getBedTemplateSettingDO(),
        (new AddOnProductCategories()).getAddOnProductSettingDO(),
        (new RoomAttributes()).getRoomAttributeSettingDO(),
        (new YieldManagerFilters()).getYieldManagerFilterSettingDO()
    ];

    private _settingsEntity: any;
    private _mongoSettingsRepository: MongoSettingsRepository;

    constructor() {
        super();
        this._settingsEntity = sails.models.settingsentity;
        this._mongoSettingsRepository = new MongoSettingsRepository();
    }
    public getPatchType(): MongoPatchType {
        return MongoPatchType.PopulateCountriesAndCurrencyCodes;
    }

    protected applyCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
        async.waterfall(
            [
                ((finishedEnsuringIndex: { (error: ThError, result?: boolean): void }) => {
                    this.ensureMetadataTypeIndexOnSettingsCollectionAsync(finishedEnsuringIndex);
                }),
                ((previousResult: boolean, finishedPopulatingSettingsCallback: any) => {
                    this.addSettingAsync(this._settingsToAdd, finishedPopulatingSettingsCallback);
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

    private ensureMetadataTypeIndexOnSettingsCollectionAsync(finishedEnsuringIndex: { (error: ThError, result?: boolean): void }) {
        var mongoRepo = new MongoRepository(this._settingsEntity);
        mongoRepo.getNativeMongoCollection().then((nativeCollection: any) => {
            nativeCollection.ensureIndex("metadata.type", { unique: true }, ((err, indexName) => {
                if (err || !indexName) {
                    var thError = new ThError(ThStatusCode.PatchErrorEnsuringUniqueIndexOnSettings, err);
                    ThLogger.getInstance().logError(ThLogLevel.Error, "AMongoDBPatch1 - ensuring metadata.type index on native settings patches collection", { step: "Bootstrap" }, thError);
                    finishedEnsuringIndex(thError);
                    return;
                }
                finishedEnsuringIndex(null, true);
            }));
        }).catch((error: any) => {
            finishedEnsuringIndex(error);
        });
    }
    private addSettingAsync(setting: Object, finishAddCallback: { (err: any, result?: boolean): void; }) {
        this._mongoSettingsRepository.addSettings(setting).then((result: boolean) => {
            finishAddCallback(null, result);
        }).catch((error: any) => {
            finishAddCallback(error);
        });
    }
}