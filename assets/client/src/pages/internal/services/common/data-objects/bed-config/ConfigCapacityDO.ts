import { BaseDO } from '../../../../../../common/base/BaseDO';
import { ThDataValidators } from '../../../../../../common/utils/form-utils/utils/ThDataValidators';

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

    public isSame(otherCapacity: ConfigCapacityDO): boolean {
        return this.noAdults === otherCapacity.noAdults
            && this.noChildren === otherCapacity.noChildren
            && this.noBabies === otherCapacity.noBabies
            && this.noBabyBeds === otherCapacity.noBabyBeds;
    }
    public valid(): boolean {
        return this.validNoAdults() && this.validNoChildren() && this.validNoBabies() && this.validNoBabyBeds() &&
            (this.noAdults > 0 || this.noChildren > 0);
    }

    public validNoAdults(): boolean {
        return this.validNoOfItems(this.noAdults);
    }
    public validNoChildren(): boolean {
        return this.validNoOfItems(this.noChildren);
    }
    public validNoBabies(): boolean {
        return this.validNoOfItems(this.noBabies);
    }
    public validNoBabyBeds(): boolean {
        return this.validNoOfItems(this.noBabyBeds);
    }
    private validNoOfItems(noOfItems: number) {
        return ThDataValidators.isValidInteger(noOfItems) && noOfItems >= 0;
    }
}