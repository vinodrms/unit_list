import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {IPriceProductConstraint} from '../IPriceProductConstraint';

export class MinimumNumberOfRoomsConstraintDO extends BaseDO implements IPriceProductConstraint {
	noOfRooms: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["noOfRooms"];
	}

}