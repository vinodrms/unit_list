import {BaseDO} from '../../../../../../common/base/BaseDO';
import {ThDateDO} from './ThDateDO';
import {ThDateUtils} from './ThDateUtils';
import {ThTranslation} from '../../../../../../common/utils/localization/ThTranslation';

export class ThDateIntervalDO extends BaseDO {
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
		return this.start.isValid() && this.end.isValid() && this.start.isBefore(this.end);
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

	public static buildThDateIntervalDO(start: ThDateDO, end: ThDateDO): ThDateIntervalDO {
		var outInterval = new ThDateIntervalDO();
		outInterval.start = start;
		outInterval.end = end;
		return outInterval;
	}

	public toString(): string {
		return this.start.toString() + " - " + this.end.toString();
	}
	public getShortDisplayString(thTranslation: ThTranslation): string {
		return this.start.getShortDisplayString(thTranslation) + " - " + this.end.getShortDisplayString(thTranslation);
	}
	public getLongDisplayString(thTranslation: ThTranslation): string {
		return thTranslation.translate("%firstDate% to %secondDate%", {firstDate: this.start.getLongDisplayString(thTranslation), secondDate: this.end.getLongDisplayString(thTranslation)})
	}
}