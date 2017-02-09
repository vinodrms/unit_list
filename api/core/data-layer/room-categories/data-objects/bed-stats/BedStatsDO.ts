import { BaseDO } from '../../../common/base/BaseDO';
import { BedStorageType } from '../../../common/data-objects/bed/BedDO';
import { ConfigCapacityDO } from '../../../common/data-objects/bed-config/ConfigCapacityDO';

export class BedStatsDO extends BaseDO {
    storageType: BedStorageType;
    capacity: ConfigCapacityDO;

    protected getPrimitivePropertyKeys(): string[] {
        return ["storageType"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.capacity = new ConfigCapacityDO;
        this.capacity.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "capacity"));
    }

    public buildPrototype(): BedStatsDO {
        let stats = new BedStatsDO();
        stats.storageType = this.storageType;
        stats.capacity = this.capacity.buildPrototype();
        return stats;
    }
}