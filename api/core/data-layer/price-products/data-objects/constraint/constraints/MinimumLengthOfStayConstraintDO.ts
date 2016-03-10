import {BaseDO} from '../../../../common/base/BaseDO';
import {PriceProductConstraintType, PriceProductConstraintDataDO, IPriceProductConstraint} from '../IPriceProductConstraint';

export class MinimumLengthOfStayConstraintDO extends BaseDO implements IPriceProductConstraint {
	minLengthOfStay: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["minLengthOfStay"];
	}

	public appliesOn(data: PriceProductConstraintDataDO): boolean {
		// TODO: apply constraint
		return true;
	}
}