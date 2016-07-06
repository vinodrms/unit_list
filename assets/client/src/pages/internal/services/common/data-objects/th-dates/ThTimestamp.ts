import {BaseDO} from '../../../../../../common/base/BaseDO';
import {ThDateDO} from './ThDateDO';
import {ThHourDO} from './ThHourDO';
import {ThDateUtils} from './ThDateUtils';

export class ThTimestamp extends BaseDO {
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

    public toString(): string {
        return this.thDateDO.toString() + " " + this.thHourDO.toString();
    }

	public getTimeDistanceFromNowString(): string {
		return moment([this.thDateDO.year, this.thDateDO.month, this.thDateDO.day, this.thHourDO.hour, this.thHourDO.minute]).fromNow();
	}
}