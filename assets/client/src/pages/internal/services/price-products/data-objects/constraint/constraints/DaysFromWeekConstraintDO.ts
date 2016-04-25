import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {ISOWeekDay, ISOWeekDayVM, ISOWeekDayUtils} from '../../../../common/data-objects/th-dates/ISOWeekDay';
import {IPriceProductConstraint} from '../IPriceProductConstraint';
import {ThTranslation} from '../../../../../../../common/utils/localization/ThTranslation';

export class DaysFromWeekConstraintDO extends BaseDO implements IPriceProductConstraint {
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
					displayString += ", ";
				}
				displayString += thTranslation.translate(isoWeekDayVM.name);
			}
		});

		return displayString;
	}
}