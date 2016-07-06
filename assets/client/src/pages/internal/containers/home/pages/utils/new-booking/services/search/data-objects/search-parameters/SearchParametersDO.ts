import {BaseDO} from '../../../../../../../../../../../common/base/BaseDO';
import {ThDateIntervalDO} from '../../../../../../../../../services/common/data-objects/th-dates/ThDateIntervalDO';
import {ConfigCapacityDO} from '../../../../../../../../../services/common/data-objects/bed-config/ConfigCapacityDO';

export class SearchParametersDO extends BaseDO {
    constructor() {
        super();
    }

    interval: ThDateIntervalDO;
    configCapacity: ConfigCapacityDO;

    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.interval = new ThDateIntervalDO();
        this.interval.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "interval"));

        this.configCapacity = new ConfigCapacityDO();
        this.configCapacity.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "configCapacity"));
    }
}