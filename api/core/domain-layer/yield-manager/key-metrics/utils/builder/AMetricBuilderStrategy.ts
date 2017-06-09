import { IMetricBuilderStrategy } from './IMetricBuilderStrategy';
import { KeyMetric, IKeyMetricValueGroup } from '../KeyMetricsResult';
import { IKeyMetricValue, KeyMetricValueType } from '../values/IKeyMetricValue';
import { KeyMetricType } from '../KeyMetricType';
import { ThDateDO } from '../../../../../utils/th-dates/data-objects/ThDateDO';
import { ThUtils } from '../../../../../utils/ThUtils';
import { IHotelInventoryStats, HotelInventoryStatsForDate } from '../../../../hotel-inventory-snapshots/stats-reader/data-objects/IHotelInventoryStats';
import { ThPeriodType, ThPeriodDO } from "../../../../reports/key-metrics/period-converter/ThPeriodDO";
import { ThDateToThPeriodConverterFactory } from "../../../../reports/key-metrics/period-converter/ThDateToThPeriodConverterFactory";
import { ThDateIntervalDO } from "../../../../../utils/th-dates/data-objects/ThDateIntervalDO";

import _ = require('underscore');

export abstract class AMetricBuilderStrategy implements IMetricBuilderStrategy {
    protected static WithoutCommissionSuffixDisplayString = " W/O Commission"; 
    private _thUtils: ThUtils;

    constructor(private _hotelInventoryStats: IHotelInventoryStats) {
        this._thUtils = new ThUtils();
    }

    public buildKeyMetric(thDateList: ThDateDO[], aggregationPeriodList: ThPeriodDO[]): KeyMetric {
        var keyMetric = new KeyMetric();
        keyMetric.type = this.getType();
        keyMetric.valueType = this.getValueType();
        keyMetric.displayName = this.getKeyMetricDisplayName();
        keyMetric.valueList = [];
        
        _.forEach(thDateList, (thDate: ThDateDO) => {
            var statsForDate = this._hotelInventoryStats.getInventoryStatsForDate(thDate);
            var keyMetricValue = this.getKeyMetricValueCore([statsForDate]);
            keyMetric.valueList.push(keyMetricValue);
        });

        keyMetric.aggregatedValueList = this.builAggregatedValueList(aggregationPeriodList);

        return keyMetric;
    }

    private builAggregatedValueList(aggregationPeriodList: ThPeriodDO[]): IKeyMetricValueGroup[] {
        let aggregatedValueList = [];
        _.forEach(aggregationPeriodList, (period: ThPeriodDO) => {
            let keyMetricValueGroup: IKeyMetricValueGroup = {
                period: period
            };

            let interval = ThDateIntervalDO.buildThDateIntervalDO(keyMetricValueGroup.period.dateStart,
                keyMetricValueGroup.period.dateEnd);
            let thDateList = interval.getThDateDOList();
            let statsForDayList = [];
            _.forEach(thDateList, (thDate: ThDateDO) => {
                statsForDayList.push(this._hotelInventoryStats.getInventoryStatsForDate(thDate));
            });
            statsForDayList = _.filter(statsForDayList, (statsForDate: HotelInventoryStatsForDate) => {
                return !_.isUndefined(statsForDate);
            });

            keyMetricValueGroup.metricValue = this.getKeyMetricValueCore(statsForDayList);
            aggregatedValueList.push(keyMetricValueGroup);
        });
        return aggregatedValueList;
    }
    
    protected roundValue(value: number): number {
        return this._thUtils.roundNumberToTwoDecimals(value);
    }
    protected roundValueToNearestInteger(value: number): number {
        return this._thUtils.roundNumberToNearestInteger(value);
    }

    protected abstract getType(): KeyMetricType;
    protected abstract getValueType(): KeyMetricValueType;
    protected abstract getKeyMetricValueCore(statsForDateList: HotelInventoryStatsForDate[]): IKeyMetricValue;
    protected abstract getKeyMetricDisplayName(): string;
}