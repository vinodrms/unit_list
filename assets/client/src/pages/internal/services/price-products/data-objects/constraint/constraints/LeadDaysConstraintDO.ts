import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {IPriceProductConstraint} from '../IPriceProductConstraint';
import {ThTranslation} from '../../../../../../../common/utils/localization/ThTranslation';

export class LeadDaysConstraintDO extends BaseDO implements IPriceProductConstraint {
	leadDays: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["leadDays"];
	}
	
	public isValid() {
		return _.isNumber(this.leadDays) && this.leadDays >= 0;
	}
	
	public getValueDisplayString(thTranslation: ThTranslation): string {
		return thTranslation.translate("%noDays% days", {noDays: this.leadDays});		
	}
}