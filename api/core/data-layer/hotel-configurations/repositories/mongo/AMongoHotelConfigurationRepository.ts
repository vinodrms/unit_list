import { ThLogger, ThLogLevel } from '../../../../utils/logging/ThLogger';
import { ThError } from '../../../../utils/th-responses/ThError';
import { ThUtils } from '../../../../utils/ThUtils';
import { ThStatusCode } from '../../../../utils/th-responses/ThResponse';
import { BaseDO } from '../../../common/base/BaseDO';
import { MongoRepository, MongoErrorCodes } from '../../../common/base/MongoRepository';
import { HotelConfigurationType, HotelConfigurationMetadataDO } from '../../data-objects/common/HotelConfigurationMetadataDO';
import { YieldFilterConfigurationDO } from '../../data-objects/yield-filter/YieldFilterConfigurationDO';
import { HotelConfigurationDO } from '../../data-objects/HotelConfigurationDO';
import { YieldFilterDO } from '../../../common/data-objects/yield-filter/YieldFilterDO';
import { YieldFilterValueDO } from '../../../common/data-objects/yield-filter/YieldFilterValueDO';

import _ = require('underscore');

declare var sails: any;

export interface HotelConfigurationMetaRepoDO {
    hotelId: string;
}

export interface HotelConfigurationItemMetaRepoDO {
    type: HotelConfigurationType;
    versionId: number;
}

export abstract class AMongoHotelConfigurationRepository extends MongoRepository {

    constructor() {
        var hotelConfigurationsEntity = sails.models.hotelconfigurationsentity;
        super(hotelConfigurationsEntity);
    }

    protected getHotelConfigurationByType(meta: HotelConfigurationMetaRepoDO, configurationType: HotelConfigurationType): Promise<HotelConfigurationDO> {
        return new Promise<HotelConfigurationDO>((resolve, reject) => {
            this.getHotelConfigurationCore(meta, configurationType, resolve, reject);
        });
    }

    private getHotelConfigurationCore(meta: HotelConfigurationMetaRepoDO, configurationType: HotelConfigurationType, resolve: { (result: any): void }, reject: { (err: ThError): void }) {
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
                var resultDO = this.getHotelConfigurationQueryResultDO(configurationRead);
                resolve(resultDO);
            }
        );
    }

    protected addHotelConfiguration(meta: HotelConfigurationMetaRepoDO, hotelConfigurationObject: HotelConfigurationDO): Promise<HotelConfigurationDO> {
        return new Promise<HotelConfigurationDO>((resolve, reject) => {
            this.addHotelConfigurationCore(resolve, reject, meta, hotelConfigurationObject);
        });
    }

    private addHotelConfigurationCore(resolve: { (result: HotelConfigurationDO): void }, reject: { (err: ThError): void }, meta: HotelConfigurationMetaRepoDO, hotelConfiguration: HotelConfigurationDO) {
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

    protected updateHotelConfiguration(hotelConfigMeta: HotelConfigurationMetaRepoDO, configurationItemMeta: HotelConfigurationItemMetaRepoDO, updateQuery: HotelConfigurationDO): Promise<HotelConfigurationDO> {
        return this.findAndModifyHotelConfiguration(hotelConfigMeta, configurationItemMeta, updateQuery);
    }

    private findAndModifyHotelConfiguration(hotelConfigMeta: HotelConfigurationMetaRepoDO, configurationItemMeta: HotelConfigurationItemMetaRepoDO, updateQuery: HotelConfigurationDO): Promise<HotelConfigurationDO> {
        return new Promise<HotelConfigurationDO>((resolve: { (result: HotelConfigurationDO): void }, reject: { (err: ThError): void }) => {
            this.findAndModifyHotelConfigurationCore(hotelConfigMeta, configurationItemMeta, updateQuery, resolve, reject);
        });
    }

    private findAndModifyHotelConfigurationCore(hotelConfigMeta: HotelConfigurationMetaRepoDO, configurationItemMeta: HotelConfigurationItemMetaRepoDO, updateQuery: any, resolve: { (result: HotelConfigurationDO): void }, reject: { (err: ThError): void }) {
        delete updateQuery.versionId;
        updateQuery.$inc = { "versionId": 1 };
        var findQuery: Object = {
            "hotelId": hotelConfigMeta.hotelId,
            "metadata.type": configurationItemMeta.type,
            "versionId": configurationItemMeta.versionId
        };
        this.findAndModifyDocument(findQuery, updateQuery,
            () => {
                var thError = new ThError(ThStatusCode.HotelConfigurationRepositoryProblemUpdatingConfiguration, null);
                ThLogger.getInstance().logBusiness(ThLogLevel.Info, "Problem updating hotel configuration - concurrency", { hotelConfigMeta: hotelConfigMeta, configurationItemMeta: configurationItemMeta, updateQuery: updateQuery }, thError);
                reject(thError);
            },
            (err: Error) => {
                this.logAndReject(err, reject, { hotelConfigMeta: hotelConfigMeta, configurationItemMeta: configurationItemMeta, updateQuery: updateQuery }, ThStatusCode.HotelConfigurationRepositoryErrorUpdatingConfiguration);
            },
            (updatedDBHotelConfiguration: Object) => {
                resolve(this.getHotelConfigurationQueryResultDO(updatedDBHotelConfiguration));
            }
        );
    }

    protected abstract getHotelConfigurationQueryResultDO(queryResult: Object): HotelConfigurationDO;

    private logAndReject(err: Error, reject: { (err: ThError): void }, context: Object, defaultStatusCode: ThStatusCode) {
        var errorCode = this.getMongoErrorCode(err);
        if (errorCode == MongoErrorCodes.DuplicateKeyError) {
            var thError = new ThError(ThStatusCode.HotelConfigurationRepositoryAlreadyExists, err);
            ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Hotel configuration already exists", context, thError);
            reject(thError);
            return;
        }
        var thError = new ThError(defaultStatusCode, err);
        ThLogger.getInstance().logError(ThLogLevel.Error, "Error adding hotel configuration", context, thError);
        reject(thError);
    }
}