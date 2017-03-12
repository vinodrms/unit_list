import { BaseDO } from '../../../common/base/BaseDO';

export class ConfigCapacityDO extends BaseDO {
    constructor() {
        super();
    }

    noAdults: number;
    noChildren: number;
    noBabies: number;
    noBabyBeds: number;

    protected getPrimitivePropertyKeys(): string[] {
        return ["noAdults", "noChildren", "noBabies", "noBabyBeds"];
    }

    public buildPrototype(): ConfigCapacityDO {
        var configCapacity = new ConfigCapacityDO();
        configCapacity.noAdults = this.noAdults;
        configCapacity.noChildren = this.noChildren;
        configCapacity.noBabies = this.noBabies;
        configCapacity.noBabyBeds = this.noBabyBeds;
        return configCapacity;
    }

    public getNoAdultsAndChildren(): number {
        return this.noAdults + this.noChildren;
    }
}