import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {ThTranslation} from '../../../../../../../common/utils/localization/ThTranslation';
import {IAllotmentConstraint} from '../IAllotmentConstraint';

export class ReleaseTimeInDaysConstraintDO extends BaseDO implements IAllotmentConstraint {
	noOfDays: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["noOfDays"];
	}

	public isValid() {
		return _.isNumber(this.noOfDays) && this.noOfDays >= 0;
	}

	public getValueDisplayString(thTranslation: ThTranslation): string {
		return thTranslation.translate("%noDays% days", { noDays: this.noOfDays });
	}
}