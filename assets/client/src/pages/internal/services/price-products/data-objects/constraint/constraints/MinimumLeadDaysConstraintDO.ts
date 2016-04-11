import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {IPriceProductConstraint} from '../IPriceProductConstraint';

export class MinimumLeadDaysConstraintDO extends BaseDO implements IPriceProductConstraint {
	leadDays: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["leadDays"];
	}

}