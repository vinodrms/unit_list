import {ThLogger, ThLogLevel} from '../../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../../utils/th-responses/ThResponse';
import {MongoPatcheType, ATransactionalMongoPatch} from '../../utils/ATransactionalMongoPatch';
import {MongoRepository} from '../../../../../../data-layer/common/base/MongoRepository';
import {SettingsMongoRepository} from '../../../../../../data-layer/settings/repositories/mongo/SettingsMongoRepository';

import {Amenities} from './data-sets/Amenities';
import {Countries} from './data-sets/Countries';
import {CurrencyCodes} from './data-sets/CurrencyCodes';
import {PaymentMethods} from './data-sets/PaymentMethods';

import async = require('async');

export class MongoPatch1 extends ATransactionalMongoPatch {
	private _settingsToAdd: Object[] = [
		(new Amenities()).getAmenitySettingDO(),
		(new Countries()).getCountrySettingDO(),
		(new CurrencyCodes()).getCurrencySettingDO(),
		(new PaymentMethods()).getPaymentMethodSettingDO()
	];

    private _settingsEntity: Sails.Model;
    private _mongoSettingsRepository: SettingsMongoRepository;

    constructor() {
        super();
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
	}
    private addSettingAsync(setting: Object, finishAddCallback: { (err: any, result?: boolean): void; }) {
        this._mongoSettingsRepository.addSettings(setting).then((result: boolean) => {
            finishAddCallback(null, result);
        }).catch((error: any) => {
            finishAddCallback(error);
        });
    }
}