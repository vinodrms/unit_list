import {BaseDO} from '../../../../common/base/BaseDO';
import {ISOWeekDay} from '../../../../../utils/th-dates/data-objects/ISOWeekDay';
import {PriceProductConstraintDataDO, IPriceProductConstraint} from '../IPriceProductConstraint';

import _ = require('underscore');

export class MustArriveOnDaysFromWeekConstraintDO extends BaseDO implements IPriceProductConstraint {
    daysFromWeek: ISOWeekDay[];

    protected getPrimitivePropertyKeys(): string[] {
        return ["daysFromWeek"];
    }

    public appliesOn(data: PriceProductConstraintDataDO): boolean {
        return _.contains(this.daysFromWeek, data.indexedBookingInterval.getArrivalDate().getISOWeekDay());
    }
}