import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {ISettingsRepository} from '../ISettingsRepository';
import {MongoRepository, MongoErrorCodes} from '../../../common/base/MongoRepository';

export class SettingsMongoRepository extends MongoRepository implements ISettingsRepository {
    private _settingsEntity: Sails.Model;

    constructor() {
		var settingsEntity = sails.models.settingsentity;
		super(settingsEntity);
		this._settingsEntity = settingsEntity;
    }

    public addSettings(setting: Object): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.addSettingsCore(resolve, reject, setting);
        });
    }
    private addSettingsCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }, setting: Object) {
        this._settingsEntity.create(setting).then((createdSetting: Sails.QueryResult) => {
            resolve(true);
        }).catch((err: Error) => {
            var errorCode = this.getMongoErrorCode(err);
            if (errorCode == MongoErrorCodes.DuplicateKeyError) {
                var thError = new ThError(ThStatusCode.SettingsMongoRepositoryAddDuplicateKeyError, err);
                ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Setting already exists", setting, thError);
                reject(thError);
            }
            else {
                var thError = new ThError(ThStatusCode.SettingsMongoRepositoryAddError, err);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Error adding setting", setting, thError);
                reject(thError);
            }
        });
    }
}