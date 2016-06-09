import {BaseDO} from '../../../../common/base/BaseDO';
import {ISOWeekDay} from '../../../../../utils/th-dates/data-objects/ISOWeekDay';
import {PriceProductConstraintDataDO, IPriceProductConstraint} from '../IPriceProductConstraint';

export class MustArriveOnDaysFromWeekConstraintDO extends BaseDO implements IPriceProductConstraint {
    daysFromWeek: ISOWeekDay[];

    protected getPrimitivePropertyKeys(): string[] {
        return ["daysFromWeek"];
    }

    public appliesOn(data: PriceProductConstraintDataDO): boolean {
        // TODO: apply constraint
        return true;
    }
}