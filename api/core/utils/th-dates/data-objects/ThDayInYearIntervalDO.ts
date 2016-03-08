import {BaseDO} from '../../../data-layer/common/base/BaseDO';
import {IThInterval} from '../../th-interval/IThInterval';
import {ThDateDO} from './ThDateDO';
import {ThDateUtils} from '../ThDateUtils';
import {ThDateComparator} from '../ThDateComparator';

export class ThDayInYearIntervalDO extends BaseDO implements IThInterval<ThDateDO> {
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
		return startMoment.isValid() && endMoment.isValid() && dateComparator.compare(this.start, this.end) <= 0;
	}

	public getStart(): ThDateDO {
		return this.start;
	}
	public getEnd(): ThDateDO {
		return this.end;
	}

	public static buildThDayInYearIntervalDO(start: ThDateDO, end: ThDateDO): ThDayInYearIntervalDO {
		var outInterval = new ThDayInYearIntervalDO();
		outInterval.start = start;
		outInterval.end = end;
		return outInterval;
	}
}