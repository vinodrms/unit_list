import {BaseDO} from '../../../../common/base/BaseDO';
import {ThTranslation} from '../../../../../utils/localization/ThTranslation';
import {ISOWeekDay} from '../../../../../utils/th-dates/data-objects/ISOWeekDay';
import {PriceProductConstraintDataDO, IPriceProductConstraint} from '../IPriceProductConstraint';
import {ConstraintUtils} from './utils/ConstraintUtils';

import _ = require('underscore');

export class MustArriveOnDaysFromWeekConstraintDO extends BaseDO implements IPriceProductConstraint {
    daysFromWeek: ISOWeekDay[];

    protected getPrimitivePropertyKeys(): string[] {
        return ["daysFromWeek"];
    }

    public appliesOn(data: PriceProductConstraintDataDO): boolean {
        return _.contains(this.daysFromWeek, data.indexedBookingInterval.getArrivalDate().getISOWeekDay());
    }

    public getValueDisplayString(thTranslation: ThTranslation): string {
        var constraintUtils = new ConstraintUtils(thTranslation);
        return thTranslation.translate("Must Arrive on %daysFromWeek%", { daysFromWeek: constraintUtils.getDaysFromWeekDisplayString(this.daysFromWeek) });
    }
}