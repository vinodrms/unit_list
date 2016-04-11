import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {IPriceProductConstraint} from '../IPriceProductConstraint';

export class MaximumLeadDaysConstraintDO extends BaseDO implements IPriceProductConstraint {
	leadDays: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["leadDays"];
	}
}