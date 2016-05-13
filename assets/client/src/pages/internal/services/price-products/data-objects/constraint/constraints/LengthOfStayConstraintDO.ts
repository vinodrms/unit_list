import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {ThDataValidators} from '../../../../../../../common/utils/form-utils/utils/ThDataValidators';
import {IPriceProductConstraint} from '../IPriceProductConstraint';
import {ThTranslation} from '../../../../../../../common/utils/localization/ThTranslation';

export class LengthOfStayConstraintDO extends BaseDO implements IPriceProductConstraint {
	minLengthOfStay: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["minLengthOfStay"];
	}
	
	public isValid() {
		return ThDataValidators.isValidInteger(this.minLengthOfStay) && this.minLengthOfStay >= 1;
	}
	public getValueDisplayString(thTranslation: ThTranslation): string {
		return thTranslation.translate("length of %noDays% days", {noDays: this.minLengthOfStay});		
	}
}