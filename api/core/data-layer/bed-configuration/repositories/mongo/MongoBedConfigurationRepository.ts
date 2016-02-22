import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {MongoRepository, MongoErrorCodes} from '../../../common/base/MongoRepository';
import {IRepositoryCleaner} from '../../../common/base/IRepositoryCleaner';
import {IBedConfigurationRepository} from '../IBedConfigurationRepository';
import {BedConfigurationDO} from '../../data-objects/BedConfigurationDO';

export class MongoBedConfigurationRepository extends MongoRepository implements IBedConfigurationRepository, IRepositoryCleaner {
    private _bedConfigurationsEntity: Sails.Model;

    constructor() {
        var bedConfigurationsEntity = sails.models.bedconfigurationsentity;
        super(bedConfigurationsEntity);
        this._bedConfigurationsEntity = bedConfigurationsEntity;
    }

    public addBedConfigurationAsync(bedConfiguration: BedConfigurationDO, finishAddBedConfigCallback: { (err: any, savedBedConfiguration?: BedConfigurationDO): void }) {
        this.addBedConfiguration(bedConfiguration).then((savedBedConfiguration: BedConfigurationDO) => {
            finishAddBedConfigCallback(null, savedBedConfiguration);
        }).catch((error: any) => {
            finishAddBedConfigCallback(error);
        });
    }

    private addBedConfiguration(bedConfiguration: BedConfigurationDO): Promise<BedConfigurationDO> {
        return new Promise<BedConfigurationDO>((resolve, reject) => {
            this.addBedConfigurationCore(resolve, reject, bedConfiguration);
        });
    }

    private addBedConfigurationCore(resolve: { (result: BedConfigurationDO): void }, reject: { (err: ThError): void }, bedConfiguration: BedConfigurationDO) {
        this._bedConfigurationsEntity.create(bedConfiguration).then((createdBedConfiguration: Sails.QueryResult) => {
            var savedBedConfiguration: BedConfigurationDO = new BedConfigurationDO();
            savedBedConfiguration.buildFromObject(createdBedConfiguration);
            resolve(savedBedConfiguration);
        }).catch((err: Error) => {
            var errorCode = this.getMongoErrorCode(err);

            if (errorCode == MongoErrorCodes.DuplicateKeyError) {
                var thError = new ThError(ThStatusCode.BedConfigRepositoryConfigAlreadyExists, err);
                ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Bed configuration already exists", bedConfiguration, thError);
                reject(thError);
            }
            else {
                var thError = new ThError(ThStatusCode.BedConfigRepositoryErrorAddingConfig, err);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Error adding bed configuration", bedConfiguration, thError);
                reject(thError);
            }
        });
    }

    public getBedConfigurationByHotelIdAsync(hotelId: string, finishGetBedConfigByHotelIdCallback: { (err: any, bedConfiguration?: BedConfigurationDO): void }) {
        this.getBedConfigurationByHotelId(hotelId).then((foundBedConfiguration: BedConfigurationDO) => {
            finishGetBedConfigByHotelIdCallback(null, foundBedConfiguration);
        }).catch((error: any) => {
            finishGetBedConfigByHotelIdCallback(error);
        });
    }

    public getBedConfigurationByHotelId(hotelId: string): Promise<BedConfigurationDO> {
        return new Promise<BedConfigurationDO>((resolve, reject) => {
            this.getBedConfigurationByHotelIdCore(resolve, reject, hotelId);
        });
    }

    private getBedConfigurationByHotelIdCore(resolve: { (result: BedConfigurationDO): void }, reject: { (err: ThError): void }, hotelId: string) {
        this._bedConfigurationsEntity.findOne({ "hotelId": hotelId }).then((foundBedConfiguration: Sails.QueryResult) => {
            if (!foundBedConfiguration) {
                var thError = new ThError(ThStatusCode.BedConfigRepositoryErrorFindingConfigByHotelId, null);
                ThLogger.getInstance().logBusiness(ThLogLevel.Info, "Invalid hotelId to retrieve bed configuration", { hotelId: hotelId }, thError);
                reject(thError);
                return;
            }
            var bedConfiguration: BedConfigurationDO = new BedConfigurationDO();
            bedConfiguration.buildFromObject(foundBedConfiguration);
            resolve(bedConfiguration);
        }).catch((err: Error) => {
            var thError = new ThError(ThStatusCode.BedConfigRepositoryErrorFindingConfig, err);
            ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting bed configuration by hotelId", { hotelId: hotelId }, thError);
            reject(thError);
        });
    }

    public cleanRepository(): Promise<Object> {
        return this._bedConfigurationsEntity.destroy({});
    }
}