import {BaseDO} from '../../../../../../common/base/BaseDO';
import {ThDateDO} from './ThDateDO';
import {ThHourDO} from './ThHourDO';
import {ThDateUtils} from './ThDateUtils';

export class ThTimestampDO extends BaseDO {
	thDateDO: ThDateDO;
	thHourDO: ThHourDO;

	constructor() {
		super();
	}
	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}
	public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.thDateDO = new ThDateDO();
        this.thDateDO.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "thDateDO"));

		this.thHourDO = new ThHourDO();
        this.thHourDO.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "thHourDO"));
    }
	public isSame(otherTimestamp: ThTimestampDO): boolean {
		return this.thDateDO.isSame(otherTimestamp.thDateDO) && this.thHourDO.isSame(otherTimestamp.thHourDO);
	}

    public toString(): string {
        return this.thDateDO.toString() + " " + this.thHourDO.toString();
    }

	public buildPrototype(): ThTimestampDO {
		var thTimestamp = new ThTimestampDO();
		thTimestamp.thDateDO = this.thDateDO.buildPrototype();
		thTimestamp.thHourDO = this.thHourDO.buildPrototype();
		return thTimestamp;
	}

	public getTimeDistanceFromNowString(): string {
		return moment([this.thDateDO.year, this.thDateDO.month, this.thDateDO.day, this.thHourDO.hour, this.thHourDO.minute]).fromNow();
	}
}