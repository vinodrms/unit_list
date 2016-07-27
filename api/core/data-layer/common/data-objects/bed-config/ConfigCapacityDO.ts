import {BaseDO} from '../../../common/base/BaseDO';

export class ConfigCapacityDO extends BaseDO {
    constructor() {
        super();
    }

    noBabies: number;
    noAdults: number;
    noChildren: number;

    protected getPrimitivePropertyKeys(): string[] {
        return ["noBabies", "noAdults", "noChildren"];
    }

    public buildPrototype(): ConfigCapacityDO {
        var configCapacity = new ConfigCapacityDO();
        configCapacity.noAdults = this.noAdults;
        configCapacity.noChildren = this.noChildren;
        configCapacity.noBabies = this.noBabies;
        return configCapacity;
    }
}