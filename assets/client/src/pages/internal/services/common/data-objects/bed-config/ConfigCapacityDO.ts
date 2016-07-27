import {BaseDO} from '../../../../../../common/base/BaseDO';
import {ThDataValidators} from '../../../../../../common/utils/form-utils/utils/ThDataValidators';

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

    public isSame(otherCapacity: ConfigCapacityDO): boolean {
        return this.noAdults === otherCapacity.noAdults
            && this.noChildren === otherCapacity.noChildren
            && this.noBabies === otherCapacity.noBabies;
    }
    public valid(): boolean {
        return this.validNoAdults() && this.validNoChildren() && this.validNoBabies() &&
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
    private validNoOfItems(noOfItems: number) {
        return ThDataValidators.isValidInteger(noOfItems) && noOfItems >= 0;
    }
}