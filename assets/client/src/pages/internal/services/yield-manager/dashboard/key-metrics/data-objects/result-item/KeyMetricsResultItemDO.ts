import {BaseDO} from '../../../../../../../../common/base/BaseDO';
import {ThDateIntervalDO} from '../../../../../common/data-objects/th-dates/ThDateIntervalDO';
import {ThDateDO} from '../../../../../common/data-objects/th-dates/ThDateDO';
import {KeyMetricDO} from './KeyMetricDO';

export class KeyMetricsResultItemDO extends BaseDO {
    interval: ThDateIntervalDO;
    dateList: ThDateDO[];
    metricList: KeyMetricDO[];

    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.interval = new ThDateIntervalDO();
        this.interval.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "interval"));

        this.dateList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "dateList"), (dateObject: Object) => {
            var thDate = new ThDateDO();
            thDate.buildFromObject(dateObject);
            this.dateList.push(thDate);
        });

        this.metricList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "metricList"), (metricObject: Object) => {
            var keyMetric = new KeyMetricDO();
            keyMetric.buildFromObject(metricObject);
            this.metricList.push(keyMetric);
        });
    }
}