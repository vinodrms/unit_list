import {BaseDO} from '../../../../common/base/BaseDO';
import {ThTranslation} from '../../../../../utils/localization/ThTranslation';
import {ISOWeekDay} from '../../../../../utils/th-dates/data-objects/ISOWeekDay';
import {PriceProductConstraintType, PriceProductConstraintDataDO, IPriceProductConstraint} from '../IPriceProductConstraint';
import {ThUtils} from '../../../../../utils/ThUtils';
import {ConstraintUtils} from './utils/ConstraintUtils';

import _ = require('underscore');

export class IncludeDaysFromWeekConstraintDO extends BaseDO implements IPriceProductConstraint {
	daysFromWeek: ISOWeekDay[];

	protected getPrimitivePropertyKeys(): string[] {
		return ["daysFromWeek"];
	}

	public appliesOn(data: PriceProductConstraintDataDO): boolean {
		var uniqueDaysFromWeekFromBooking: ISOWeekDay[] = data.indexedBookingInterval.uniqueBookingISOWeekDayList;
		var isValid: boolean = true;
		_.forEach(uniqueDaysFromWeekFromBooking, (isoWeekDayFromBooking: ISOWeekDay) => {
			if (!this.containsDayFromWeek(isoWeekDayFromBooking)) {
				isValid = false;
			}
		});
		return isValid;
	}
	private containsDayFromWeek(isoWeekDay: ISOWeekDay): boolean {
		return _.contains(this.daysFromWeek, isoWeekDay);
	}

	public getValueDisplayString(thTranslation: ThTranslation): string {
		var constraintUtils = new ConstraintUtils(thTranslation);
		return thTranslation.translate("Must Include %daysFromWeek%", { daysFromWeek: constraintUtils.getDaysFromWeekDisplayString(this.daysFromWeek) });
	}
}