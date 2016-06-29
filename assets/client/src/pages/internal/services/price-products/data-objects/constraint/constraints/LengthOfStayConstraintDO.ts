import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {ThDataValidators} from '../../../../../../../common/utils/form-utils/utils/ThDataValidators';
import {IPriceProductConstraint} from '../IPriceProductConstraint';
import {ThTranslation} from '../../../../../../../common/utils/localization/ThTranslation';

export class LengthOfStayConstraintDO extends BaseDO implements IPriceProductConstraint {
	lengthOfStay: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["lengthOfStay"];
	}
	
	public isValid() {
		return ThDataValidators.isValidInteger(this.lengthOfStay) && this.lengthOfStay >= 1;
	}
	public getValueDisplayString(thTranslation: ThTranslation): string {
		return thTranslation.translate("length of %noDays% days", {noDays: this.lengthOfStay});		
	}
	public getBriefValueDisplayString(thTranslation: ThTranslation): string {
		return this.getValueDisplayString(thTranslation);
	}
}