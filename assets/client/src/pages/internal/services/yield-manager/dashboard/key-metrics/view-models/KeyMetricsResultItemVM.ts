import {ThDateIntervalDO} from '../../../../common/data-objects/th-dates/ThDateIntervalDO';
import {ThDateDO} from '../../../../common/data-objects/th-dates/ThDateDO';
import {KeyMetricVM} from './key-metric/KeyMetricVM';

export class KeyMetricsResultItemVM {
    private _interval: ThDateIntervalDO;
    private _dateList: ThDateDO[];
    private _metricVMList: KeyMetricVM[];

    public get interval(): ThDateIntervalDO {
        return this._interval;
    }
    public set interval(interval: ThDateIntervalDO) {
        this._interval = interval;
    }

    public get dateList(): ThDateDO[] {
        return this._dateList;
    }
    public set dateList(dateList: ThDateDO[]) {
        this._dateList = dateList;
    }

    public get metricVMList(): KeyMetricVM[] {
        return this._metricVMList;
    }
    public set metricVMList(metricVMList: KeyMetricVM[]) {
        this._metricVMList = metricVMList;
    }
}