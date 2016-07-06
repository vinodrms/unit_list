import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {ThDataValidators} from '../../../../../../../common/utils/form-utils/utils/ThDataValidators';
import {IPriceProductConstraint} from '../IPriceProductConstraint';
import {ThTranslation} from '../../../../../../../common/utils/localization/ThTranslation';

export class NumberOfAdultsConstraintDO extends BaseDO implements IPriceProductConstraint {
    noOfAdults: number;

    protected getPrimitivePropertyKeys(): string[] {
        return ["noOfAdults"];
    }
    public isValid() {
        return ThDataValidators.isValidInteger(this.noOfAdults) && this.noOfAdults >= 1;
    }
    public getValueDisplayString(thTranslation: ThTranslation): string {
        return thTranslation.translate("%noOfAdults% adults", { noOfAdults: this.noOfAdults });
    }
    public getBriefValueDisplayString(thTranslation: ThTranslation): string {
		return this.getValueDisplayString(thTranslation);
	}
}