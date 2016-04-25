import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThUtils} from '../../../../utils/ThUtils';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {HotelConfigurationType, HotelConfigurationMetadataDO} from '../../data-objects/common/HotelConfigurationMetadataDO';
import {YieldFilterConfigurationDO} from '../../data-objects/yield-filter/YieldFilterConfigurationDO';
import {YieldFilterDO, YieldFilterType} from '../../../common/data-objects/yield-filter/YieldFilterDO';
import {YieldFilterValueDO} from '../../../common/data-objects/yield-filter/YieldFilterValueDO';
import {AMongoHotelConfigurationRepository, HotelConfigurationMetaRepoDO} from './AMongoHotelConfigurationRepository';
import {IYieldFilterConfigurationRepository, YieldFilterMetaRepoDO, YieldFilterValueMetaRepoDO} from '../IYieldFilterConfigurationRepository';
import {HotelConfigurationDO} from '../../data-objects/HotelConfigurationDO';

import _ = require("underscore");

export class MongoYieldFilterConfigurationRepository extends AMongoHotelConfigurationRepository implements IYieldFilterConfigurationRepository {

    public addYieldFilterValue(meta: HotelConfigurationMetaRepoDO, filterMeta: YieldFilterMetaRepoDO, yieldFilterValue: YieldFilterValueDO): Promise<YieldFilterValueDO> {
        return new Promise<YieldFilterValueDO>((resolve, reject) => {
            this.addYieldFilterValueCore(meta, filterMeta, yieldFilterValue, resolve, reject);
        });
    }

    public addYieldFilterValueCore(meta: HotelConfigurationMetaRepoDO, filterMeta: YieldFilterMetaRepoDO, yieldFilterValue: YieldFilterValueDO,
        resolve: { (result: YieldFilterValueDO): void }, reject: { (err: ThError): void }) {

        this.getYieldFilterConfiguration(meta).then((yieldFilterConfig: YieldFilterConfigurationDO) => {
            var foundYieldFilter = _.findWhere(yieldFilterConfig.value, { id: filterMeta.filterId });

            if (!this._thUtils.isUndefinedOrNull(foundYieldFilter)) {
                var foundYieldFilterIndex = _.indexOf(yieldFilterConfig.value, foundYieldFilter);

                this.runFilterValueValidations(yieldFilterValue, foundYieldFilter, { hotelId: meta.hotelId, filterMeta: filterMeta, yieldFilterValue: yieldFilterValue });

                yieldFilterValue.id = this._thUtils.generateUniqueID();
                yieldFilterConfig.value[foundYieldFilterIndex].values.push(yieldFilterValue);

                return this.updateHotelConfiguration(meta, { type: HotelConfigurationType.YieldFilter, versionId: yieldFilterConfig.versionId }, yieldFilterConfig);
            }
            else {
                var thError = new ThError(ThStatusCode.YieldFilterRepositoryErrorGettingYieldFilter, null);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Error finding yield filter by id", { hotelId: meta.hotelId, filterMeta: filterMeta }, thError);
                throw (thError);
            }
        }).then((addedHotelConfig: HotelConfigurationDO) => {
            resolve(yieldFilterValue);
        }).catch((err: Error) => {
            var thError = new ThError(ThStatusCode.YieldFilterRepositoryErrorAddingYieldFilterValue, err);
            ThLogger.getInstance().logError(ThLogLevel.Error, "Error adding filter value", { hotelId: meta.hotelId, filterMeta: filterMeta, yieldManagerFilterValue: yieldFilterValue }, thError);
            reject(thError);
        });
    }

    public updateYieldFilterValue(meta: HotelConfigurationMetaRepoDO, filterMeta: YieldFilterMetaRepoDO, filterValueMeta: YieldFilterValueMetaRepoDO, yieldFilterValue: YieldFilterValueDO): Promise<YieldFilterValueDO> {
        return new Promise<YieldFilterValueDO>((resolve, reject) => {
            this.updateYieldFilterValueCore(meta, filterMeta, filterValueMeta, yieldFilterValue, resolve, reject);
        });
    }

    private updateYieldFilterValueCore(meta: HotelConfigurationMetaRepoDO, filterMeta: YieldFilterMetaRepoDO, filterValueMeta: YieldFilterValueMetaRepoDO, yieldFilterValue: YieldFilterValueDO,
        resolve: { (result: YieldFilterValueDO): void }, reject: { (err: ThError): void }) {

        this.getYieldFilterConfiguration(meta).then((yieldFilterConfig: YieldFilterConfigurationDO) => {
            var foundYieldFilter = _.findWhere(yieldFilterConfig.value, { id: filterMeta.filterId });
            if (!this._thUtils.isUndefinedOrNull(foundYieldFilter)) {
                var foundYieldFilterIndex = _.indexOf(yieldFilterConfig.value, foundYieldFilter);
                var foundYieldFilterValue = _.findWhere(foundYieldFilter.values, { id: filterValueMeta.filterValueId });

                if (!this._thUtils.isUndefinedOrNull(foundYieldFilterValue)) {

                    this.runFilterValueValidations(yieldFilterValue, foundYieldFilter, { hotelId: meta.hotelId, filterMeta: filterMeta, yieldFilterValue: yieldFilterValue });

                    var foundYieldFilterValueIndex = _.indexOf(foundYieldFilter.values, foundYieldFilterValue);
                    yieldFilterConfig.value[foundYieldFilterIndex].values[foundYieldFilterValueIndex] = yieldFilterValue;
                    return this.updateHotelConfiguration(meta, { type: HotelConfigurationType.YieldFilter, versionId: yieldFilterConfig.versionId }, yieldFilterConfig);
                }
                else {
                    var thError = new ThError(ThStatusCode.YieldFilterRepositoryErrorGettingYieldFilterValue, null);
                    ThLogger.getInstance().logError(ThLogLevel.Error, "Error finding yield filter value by id", { hotelId: meta.hotelId, filterMeta: filterMeta }, thError);
                    throw (thError);
                }
            }
            else {
                var thError = new ThError(ThStatusCode.YieldFilterRepositoryErrorGettingYieldFilter, null);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Error finding yield filter by id", { hotelId: meta.hotelId, filterMeta: filterMeta }, thError);
                throw (thError);
            }
        }).then((addedHotelConfig: HotelConfigurationDO) => {
            resolve(yieldFilterValue);
        }).catch((err: Error) => {
            var thError = new ThError(ThStatusCode.YieldFilterRepositoryErrorUpdatingYieldFilterValue, err);
            ThLogger.getInstance().logError(ThLogLevel.Error, "Error updating filter value", { hotelId: meta.hotelId, filterMeta: filterMeta, yieldManagerFilterValue: yieldFilterValue }, thError);
            reject(thError);
        });
    }

    private runFilterValueValidations(yieldFilterValue: YieldFilterValueDO, yieldFilter: YieldFilterDO, context: Object) {
        if (!this.filterValueAdditionValid(yieldFilterValue, yieldFilter)) {
            var thError = new ThError(ThStatusCode.YieldFilterRepositoryErrorDuplicateFilterValue, null);
            ThLogger.getInstance().logError(ThLogLevel.Error, "Duplicate yield filter value", context, thError);
            throw (thError);
        }

        if (!this.filterValueColorCodeAndLabelValid(yieldFilterValue, yieldFilter)) {
            var thError = new ThError(ThStatusCode.YieldFilterRepositoryErrorLabelOrColorCodeInvalid, null);
            ThLogger.getInstance().logError(ThLogLevel.Error, "(colorCode, label) invalid", context, thError);
            throw (thError);
        }
    }

    private filterValueColorCodeAndLabelValid(yieldFilterValue: YieldFilterValueDO, yieldFilter: YieldFilterDO): boolean {
        if (yieldFilter.type == YieldFilterType.Text) {
            return (!this._thUtils.isUndefinedOrNull(yieldFilterValue.label) && yieldFilterValue.label.trim() != '') && this._thUtils.isUndefinedOrNull(yieldFilterValue.colorCode);
        }
        else {
            return this._thUtils.isUndefinedOrNull(yieldFilterValue.label) && (!this._thUtils.isUndefinedOrNull(yieldFilterValue.colorCode) && yieldFilterValue.colorCode.trim() != '');
        }
    }

    private filterValueUpdateValid(yieldFilterValue: YieldFilterValueDO, yieldFilter: YieldFilterDO): boolean {
        var sameYieldValueItems = [];
        if (yieldFilter.type == YieldFilterType.Text) {
            sameYieldValueItems = _.filter(yieldFilter.values, (value: YieldFilterValueDO) => {
                return value.label === yieldFilterValue.label && value.id != yieldFilterValue.id;
            });
        }
        else {
            sameYieldValueItems = _.filter(yieldFilter.values, (value: YieldFilterValueDO) => {
                return value.colorCode === yieldFilterValue.colorCode && value.id != yieldFilterValue.id;
            });
        }
        return _.isEmpty(sameYieldValueItems);
    }

    private filterValueAdditionValid(yieldFilterValue: YieldFilterValueDO, yieldFilter: YieldFilterDO): boolean {
        var sameYieldValueItems = [];
        if (yieldFilter.type == YieldFilterType.Text) {
            sameYieldValueItems = _.filter(yieldFilter.values, (value: YieldFilterValueDO) => {
                return value.label === yieldFilterValue.label && value.id !== yieldFilterValue.id;
            });
        }
        else {
            sameYieldValueItems = _.filter(yieldFilter.values, (value: YieldFilterValueDO) => {
                return value.colorCode === yieldFilterValue.colorCode && value.id !== yieldFilterValue.id;
            });
        }
        return _.isEmpty(sameYieldValueItems);
    }

    public getYieldFilterConfiguration(meta: HotelConfigurationMetaRepoDO): Promise<YieldFilterConfigurationDO> {
        return <Promise<YieldFilterConfigurationDO>>this.getHotelConfigurationByType(meta, HotelConfigurationType.YieldFilter);
    }

    public initYieldFilterConfigurationWithDefaults(meta: HotelConfigurationMetaRepoDO, initialYieldFilterList: YieldFilterDO[]): Promise<YieldFilterConfigurationDO> {
        return new Promise<YieldFilterConfigurationDO>((resolve, reject) => {
            this.initYieldFilterConfigurationWithDefaultsCore(resolve, reject, meta, initialYieldFilterList);
        });
    }

    private initYieldFilterConfigurationWithDefaultsCore(resolve: { (result: YieldFilterConfigurationDO): void }, reject: { (err: ThError): void }, meta: HotelConfigurationMetaRepoDO, initialYieldManagerFilterList: YieldFilterDO[]) {
        var hotelConfiguration = new HotelConfigurationDO();
        hotelConfiguration.metadata = new HotelConfigurationMetadataDO();
        hotelConfiguration.metadata.name = "Hotel Yield Filters";
        hotelConfiguration.metadata.type = HotelConfigurationType.YieldFilter;
        hotelConfiguration.value = [];

        initialYieldManagerFilterList.forEach((yieldManagerFilter: YieldFilterDO) => {
            hotelConfiguration.value.push(yieldManagerFilter);
        });

        this.addHotelConfiguration(meta, hotelConfiguration).then((addedConfig: HotelConfigurationDO) => {
            resolve(<YieldFilterConfigurationDO>addedConfig);
        }).catch((err: Error) => {
            var thError = new ThError(ThStatusCode.HotelConfigurationRepositoryErrorAddingConfiguration, err);
            ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Hotel configuration already exists", context, thError);
            reject(thError);
        });
    }

    protected getHotelConfigurationQueryResultDO(queryResult: Object): HotelConfigurationDO {
        var getConfigurationResponseDO = new YieldFilterConfigurationDO();
        getConfigurationResponseDO.buildFromObject(queryResult);
        return getConfigurationResponseDO;
    }
}