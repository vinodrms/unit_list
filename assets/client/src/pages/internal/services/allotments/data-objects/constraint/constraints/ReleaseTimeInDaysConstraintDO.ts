import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {ThTranslation} from '../../../../../../../common/utils/localization/ThTranslation';
import {ThDataValidators} from '../../../../../../../common/utils/form-utils/utils/ThDataValidators';
import {IAllotmentConstraint} from '../IAllotmentConstraint';

export class ReleaseTimeInDaysConstraintDO extends BaseDO implements IAllotmentConstraint {
	noOfDays: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["noOfDays"];
	}

	public isValid() {
		return ThDataValidators.isValidInteger(this.noOfDays);
	}

	public getValueDisplayString(thTranslation: ThTranslation): string {
		return thTranslation.translate("%noDays% days", { noDays: this.noOfDays });
	}
	public getBriefValueDisplayString(thTranslation: ThTranslation): string {
		return this.getValueDisplayString(thTranslation);
	}
}