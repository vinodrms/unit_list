import {IMetricBuilderStrategy} from './IMetricBuilderStrategy';
import {IKeyMetricValue, KeyMetric, KeyMetricValueType} from '../KeyMetricsResult';
import {KeyMetricType} from '../KeyMetricType';
import {ThDateDO} from '../../../../../utils/th-dates/data-objects/ThDateDO';
import {IHotelInventoryStats, HotelInventoryStatsForDate} from '../../../../hotel-inventory-snapshots/stats-reader/data-objects/IHotelInventoryStats';

import _ = require('underscore');

export abstract class AMetricBuilderStrategy implements IMetricBuilderStrategy {
    constructor(private _hotelInventoryStats: IHotelInventoryStats) {
    }

    public buildKeyMetric(thDateList: ThDateDO[]): KeyMetric {
        var keyMetric = new KeyMetric();
        keyMetric.type = this.getType();
        keyMetric.valueType = this.getValueType();
        keyMetric.valueList = [];
        _.forEach(thDateList, (thDate: ThDateDO) => {
            var statsForDate = this._hotelInventoryStats.getInventoryStatsForDate(thDate);
            var keyMetricValue = this.getKeyMetricValueCore(statsForDate);
            keyMetric.valueList.push(keyMetricValue);
        });
        return keyMetric;
    }

    protected roundValue(value: number): number {
        return Math.round(value * 100) / 100;
    }

    protected abstract getType(): KeyMetricType;
    protected abstract getValueType(): KeyMetricValueType;
    protected abstract getKeyMetricValueCore(statsForDate: HotelInventoryStatsForDate): IKeyMetricValue;
}