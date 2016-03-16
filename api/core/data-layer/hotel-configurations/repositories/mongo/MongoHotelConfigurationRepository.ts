import {IHotelConfigurationRepository} from '../IHotelConfigurationRepository';
import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {BaseDO} from '../../../common/base/BaseDO';
import {MongoRepository, MongoErrorCodes} from '../../../common/base/MongoRepository';
import {HotelConfigurationType, HotelConfigurationMetadataDO} from '../../data-objects/common/HotelConfigurationMetadataDO';
import {YieldManagerFilterConfigurationDO} from '../../data-objects/yield-manager-filter/YieldManagerFilterConfigurationDO';
import {IHotelConfigurationMeta} from '../IHotelConfigurationRepository';
import {HotelConfigurationDO} from '../../data-objects/HotelConfigurationDO';
import {YieldManagerFilterDO} from '../../../common/data-objects/yield-manager-filter/YieldManagerFilterDO';

export class MongoHotelConfigurationRepository extends MongoRepository implements IHotelConfigurationRepository {

    constructor() {
        var hotelConfigurationsEntity = sails.models.hotelconfigurationsentity;
        super(hotelConfigurationsEntity);
    }

    public getYieldManagerFilterConfiguration(meta: IHotelConfigurationMeta): Promise<YieldManagerFilterConfigurationDO> {
        return <Promise<YieldManagerFilterConfigurationDO>>this.getHotelConfigurationByType(meta, HotelConfigurationType.YieldManagerFilter);
    }

    private getHotelConfigurationByType(meta: IHotelConfigurationMeta, configurationType: HotelConfigurationType): Promise<HotelConfigurationDO> {
        return new Promise<HotelConfigurationDO>((resolve, reject) => {
            this.getHotelConfigurationCore(meta, configurationType, resolve, reject);
        });
    }

    private getHotelConfigurationCore(meta: IHotelConfigurationMeta, configurationType: HotelConfigurationType, resolve: { (result: any): void }, reject: { (err: ThError): void }) {
        this.findOneDocument({ "hotelId": meta.hotelId, "metadata.type": configurationType },
            () => {
                var thError = new ThError(ThStatusCode.HotelConfigurationRepositoryNotFound, null);
                ThLogger.getInstance().logBusiness(ThLogLevel.Error, "Configuration not found", { configurationType: configurationType }, thError);
                reject(thError);
            },
            (err: Error) => {
                var thError = new ThError(ThStatusCode.HotelConfigurationRepositoryReadError, err);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Error retrieving configuration.", { configurationType: configurationType }, thError);
                reject(thError);
            },
            (configurationRead: Object) => {
                var resultDO = this.getHotelConfigurationQueryResultDO(configurationType, configurationRead);
                resolve(resultDO);
            }
        );
    }

    private getHotelConfigurationQueryResultDO(configurationType: HotelConfigurationType, queryResult: Object): HotelConfigurationDO {
        var getConfigurationResponseDO: HotelConfigurationDO;
        switch (configurationType) {
            case HotelConfigurationType.YieldManagerFilter: getConfigurationResponseDO = new YieldManagerFilterConfigurationDO(); break;
            default: getConfigurationResponseDO = new YieldManagerFilterConfigurationDO();
        }
        getConfigurationResponseDO.buildFromObject(queryResult);
        return getConfigurationResponseDO;
    }

    public initYieldManagerFilterConfigurationWithDefaults(meta: IHotelConfigurationMeta, initialYieldManagerFilterList: YieldManagerFilterDO[]): Promise<YieldManagerFilterConfigurationDO> {
        return new Promise<YieldManagerFilterConfigurationDO>((resolve, reject) => {
            this.initYieldManagerFilterConfigurationWithDefaultsCore(resolve, reject, meta, initialYieldManagerFilterList);
        });
    }

    public initYieldManagerFilterConfigurationWithDefaultsCore(resolve: { (result: YieldManagerFilterConfigurationDO): void }, reject: { (err: ThError): void }, meta: IHotelConfigurationMeta, initialYieldManagerFilterList: YieldManagerFilterDO[]) {
        var hotelConfiguration = new HotelConfigurationDO();
        hotelConfiguration.metadata = new HotelConfigurationMetadataDO();
        hotelConfiguration.metadata.name = "Hotel Yield Manager Filters";
        hotelConfiguration.metadata.type = HotelConfigurationType.YieldManagerFilter;
        hotelConfiguration.value = [];

        initialYieldManagerFilterList.forEach((yieldManagerFilter: YieldManagerFilterDO) => {
            hotelConfiguration.value.push(yieldManagerFilter);
        });

        this.addHotelConfiguration(meta, hotelConfiguration).then((addedConfig: HotelConfigurationDO) => {
            resolve(<YieldManagerFilterConfigurationDO>addedConfig);
        }).catch((err: Error) => {
            var thError = new ThError(ThStatusCode.HotelConfigurationRepositoryErrorAddingConfiguration, err);
            ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Hotel configuration already exists", context, thError);
            reject(thError);
        });
    }

    private addHotelConfiguration(meta: IHotelConfigurationMeta, hotelConfigurationObject: HotelConfigurationDO): Promise<HotelConfigurationDO> {
        return new Promise<HotelConfigurationDO>((resolve, reject) => {
            this.addHotelConfigurationCore(resolve, reject, meta, hotelConfigurationObject);
        });
    }

    private addHotelConfigurationCore(resolve: { (result: HotelConfigurationDO): void }, reject: { (err: ThError): void }, meta: IHotelConfigurationMeta, hotelConfiguration: HotelConfigurationDO) {
        hotelConfiguration.hotelId = meta.hotelId;
        hotelConfiguration.versionId = 0;

        this.createDocument(hotelConfiguration,
            (err: Error) => {
                this.logAndReject(err, reject, { hotelConfiguration: hotelConfiguration }, ThStatusCode.HotelConfigurationRepositoryErrorAddingConfiguration);
            },
            (createdConfiguration: HotelConfigurationDO) => {
                resolve(createdConfiguration);
            }
        );
    }

    private logAndReject(err: Error, reject: { (err: ThError): void }, context: Object, defaultStatusCode: ThStatusCode) {
        var errorCode = this.getMongoErrorCode(err);
        if (errorCode == MongoErrorCodes.DuplicateKeyError) {
            var thError = new ThError(ThStatusCode.HotelConfigurationRepositorAlreadyExists, err);
            ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Hotel configuration already exists", context, thError);
            reject(thError);
            return;
        }
        var thError = new ThError(defaultStatusCode, err);
        ThLogger.getInstance().logError(ThLogLevel.Error, "Error adding hotel configuration", context, thError);
        reject(thError);
    }
}