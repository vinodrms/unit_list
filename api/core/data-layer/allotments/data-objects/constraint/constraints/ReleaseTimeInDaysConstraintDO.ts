import {BaseDO} from '../../../../common/base/BaseDO';
import {IAllotmentConstraint} from '../IAllotmentConstraint';

export class ReleaseTimeInDaysConstraintDO extends BaseDO implements IAllotmentConstraint {
	noOfDays: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["noOfDays"];
	}
}