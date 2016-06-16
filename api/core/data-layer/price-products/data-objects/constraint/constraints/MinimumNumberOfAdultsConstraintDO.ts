import {BaseDO} from '../../../../common/base/BaseDO';
import {PriceProductConstraintDataDO, IPriceProductConstraint} from '../IPriceProductConstraint';

export class MinimumNumberOfAdultsConstraintDO extends BaseDO implements IPriceProductConstraint {
    noOfAdults: number;

    protected getPrimitivePropertyKeys(): string[] {
        return ["noOfAdults"];
    }

    public appliesOn(data: PriceProductConstraintDataDO): boolean {
        return this.noOfAdults <= data.configCapacity.noAdults;
    }
}