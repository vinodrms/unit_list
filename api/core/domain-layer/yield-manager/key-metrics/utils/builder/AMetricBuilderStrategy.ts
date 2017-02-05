import { IMetricBuilderStrategy } from './IMetricBuilderStrategy';
import { KeyMetric } from '../KeyMetricsResult';
import { IKeyMetricValue, KeyMetricValueType } from '../values/IKeyMetricValue';
import { KeyMetricType } from '../KeyMetricType';
import { ThDateDO } from '../../../../../utils/th-dates/data-objects/ThDateDO';
import { ThUtils } from '../../../../../utils/ThUtils';
import { IHotelInventoryStats, HotelInventoryStatsForDate } from '../../../../hotel-inventory-snapshots/stats-reader/data-objects/IHotelInventoryStats';

import _ = require('underscore');

export abstract class AMetricBuilderStrategy implements IMetricBuilderStrategy {
    private _thUtils: ThUtils;

    constructor(private _hotelInventoryStats: IHotelInventoryStats) {
        this._thUtils = new ThUtils();
    }

    public buildKeyMetric(thDateList: ThDateDO[]): KeyMetric {
        var keyMetric = new KeyMetric();
        keyMetric.type = this.getType();
        keyMetric.valueType = this.getValueType();
        keyMetric.displayName = this.getKeyMetricDisplayName();
        keyMetric.valueList = [];
        _.forEach(thDateList, (thDate: ThDateDO) => {
            var statsForDate = this._hotelInventoryStats.getInventoryStatsForDate(thDate);
            var keyMetricValue = this.getKeyMetricValueCore(statsForDate);
            keyMetric.valueList.push(keyMetricValue);
        });
        return keyMetric;
    }

    protected roundValue(value: number): number {
        return this._thUtils.roundNumberToTwoDecimals(value);
    }
    protected roundValueToNearestInteger(value: number): number {
        return this._thUtils.roundNumberToNearestInteger(value);
    }

    protected abstract getType(): KeyMetricType;
    protected abstract getValueType(): KeyMetricValueType;
    protected abstract getKeyMetricValueCore(statsForDate: HotelInventoryStatsForDate): IKeyMetricValue;
    protected abstract getKeyMetricDisplayName(): string;
}