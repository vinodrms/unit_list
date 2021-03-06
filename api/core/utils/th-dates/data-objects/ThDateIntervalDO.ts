import { BaseDO } from '../../../data-layer/common/base/BaseDO';
import { IThInterval } from '../../th-interval/IThInterval';
import { ThDateDO } from './ThDateDO';
import { ThDateUtils } from '../ThDateUtils';
import { ThDateComparator } from '../ThDateComparator';

export class ThDateIntervalDO extends BaseDO implements IThInterval<ThDateDO> {
	start: ThDateDO;
	end: ThDateDO;

	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}
	public buildFromObject(object: Object) {
		this.start = new ThDateDO();
		this.start.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "start"));

		this.end = new ThDateDO();
		this.end.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "end"));
	}

	public isValid(): boolean {
		var thDateUtils = new ThDateUtils();
		var startMoment = thDateUtils.convertThDateDOToMoment(this.start);
		var endMoment = thDateUtils.convertThDateDOToMoment(this.end);
		var dateComparator = new ThDateComparator();
		return startMoment.isValid() && endMoment.isValid() && dateComparator.compare(this.start, this.end) < 0;
	}

	public getNumberOfDays(): number {
		var thDateUtils = new ThDateUtils();
		var startMoment = thDateUtils.convertThDateDOToMoment(this.start);
		var endMoment = thDateUtils.convertThDateDOToMoment(this.end);
		return endMoment.diff(startMoment, "days");
	}

	public getStart(): ThDateDO {
		return this.start;
	}
	public getEnd(): ThDateDO {
		return this.end;
	}
	public getThDateDOList(): ThDateDO[] {
		var dateList: ThDateDO[] = [];
		if (!this.isValid() && !this.start.isSame(this.end)) {
			return dateList;
		}
		var thDateUtils = new ThDateUtils();
		var currentDate = this.start.buildPrototype();
		while (!currentDate.isAfter(this.end)) {
			dateList.push(currentDate);
			currentDate = thDateUtils.addDaysToThDateDO(currentDate.buildPrototype(), 1);
		}
		return dateList;
	}

	public static buildThDateIntervalDO(start: ThDateDO, end: ThDateDO): ThDateIntervalDO {
		var outInterval = new ThDateIntervalDO();
		outInterval.start = start;
		outInterval.end = end;
		return outInterval;
	}
	public buildPrototype(): ThDateIntervalDO {
		return ThDateIntervalDO.buildThDateIntervalDO(this.start.buildPrototype(), this.end.buildPrototype());
	}

	public toString(): string {
		return this.start.toString() + " - " + this.end.toString();
	}
}