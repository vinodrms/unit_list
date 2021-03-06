import { BaseDO } from '../../../../../../../common/base/BaseDO';
import { ISOWeekDay, ISOWeekDayVM, ISOWeekDayUtils } from '../../../../common/data-objects/th-dates/ISOWeekDay';
import { IPriceProductConstraint } from '../IPriceProductConstraint';
import { IAllotmentConstraint } from '../../../../allotments/data-objects/constraint/IAllotmentConstraint';
import { ThTranslation } from '../../../../../../../common/utils/localization/ThTranslation';

import * as _ from "underscore";

export class DaysFromWeekConstraintDO extends BaseDO implements IPriceProductConstraint, IAllotmentConstraint {
	private static MaxWeekDayStringLength: number = 3;
	daysFromWeek: ISOWeekDay[];

	constructor() {
		super();
		this.daysFromWeek = [];
	}

	protected getPrimitivePropertyKeys(): string[] {
		return ["daysFromWeek"];
	}

	public isValid() {
		return _.isArray(this.daysFromWeek) && this.daysFromWeek.length > 0;
	}

	public includesDay(weekDay: ISOWeekDay): boolean {
		return _.contains(this.daysFromWeek, weekDay);
	}
	public addOrRemove(weekDay: ISOWeekDay) {
		if (this.includesDay(weekDay)) {
			this.daysFromWeek = _.filter(this.daysFromWeek, (day: ISOWeekDay) => { return day !== weekDay });
		}
		else {
			this.daysFromWeek.push(weekDay);
			this.daysFromWeek = _.sortBy(this.daysFromWeek, (isoWeekDay: ISOWeekDay) => { return isoWeekDay });
		}
	}

	public getValueDisplayString(thTranslation: ThTranslation): string {
		var isoWeekDayUtils = new ISOWeekDayUtils();
		var isoWeekDayVMList: ISOWeekDayVM[] = isoWeekDayUtils.getISOWeekDayVMList();
		var displayString = "";
		_.forEach(isoWeekDayVMList, (isoWeekDayVM: ISOWeekDayVM) => {
			if (this.includesDay(isoWeekDayVM.iSOWeekDay)) {
				if (displayString.length > 0) {
					displayString += " ";
				}
				var weekDayName = thTranslation.translate(isoWeekDayVM.name);
				if (_.isString(weekDayName) && (weekDayName.length > DaysFromWeekConstraintDO.MaxWeekDayStringLength)) {
					weekDayName = weekDayName.substr(0, 3);
				}
				displayString += weekDayName;
			}
		});

		return displayString;
	}
	public getBriefValueDisplayString(thTranslation: ThTranslation): string {
		return this.getValueDisplayString(thTranslation);
	}
}