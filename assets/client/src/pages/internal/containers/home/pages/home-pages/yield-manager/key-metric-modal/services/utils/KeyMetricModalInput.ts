import {ThDateIntervalDO} from '../../../../../../../../services/common/data-objects/th-dates/ThDateIntervalDO';
import {ThDateDO} from '../../../../../../../../services/common/data-objects/th-dates/ThDateDO';
import {KeyMetricVM} from '../../../../../../../../services/yield-manager/dashboard/key-metrics/view-models/key-metric/KeyMetricVM';

export interface KeyMetricItem {
    interval: ThDateIntervalDO;
    dateList: ThDateDO[];
    metricVM: KeyMetricVM;
}
export class KeyMetricModalInput {
    currentItem: KeyMetricItem;
    previousItem: KeyMetricItem;
}