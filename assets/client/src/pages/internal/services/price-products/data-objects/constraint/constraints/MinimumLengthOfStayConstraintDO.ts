import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {IPriceProductConstraint} from '../IPriceProductConstraint';

export class MinimumLengthOfStayConstraintDO extends BaseDO implements IPriceProductConstraint {
	minLengthOfStay: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["minLengthOfStay"];
	}

}