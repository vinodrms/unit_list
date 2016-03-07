import {BaseDO} from '../../../data-layer/common/base/BaseDO';
import {ThDayInYearDO} from './ThDayInYearDO';
import {IThInterval} from '../../th-interval/IThInterval';

export class ThDayInYearIntervalDO extends BaseDO implements IThInterval<ThDayInYearDO> {
	start: ThDayInYearDO;
	end: ThDayInYearDO;

	protected getPrimitivePropertyKeys(): string[] {
        return [];
    }
	public buildFromObject(object: Object) {
		this.start = new ThDayInYearDO();
		this.start.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "start"));

		this.end = new ThDayInYearDO();
		this.end.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "end"));
	}

	public getStart(): ThDayInYearDO {
		return this.start;
	}
	public getEnd(): ThDayInYearDO {
		return this.end;
	}
}