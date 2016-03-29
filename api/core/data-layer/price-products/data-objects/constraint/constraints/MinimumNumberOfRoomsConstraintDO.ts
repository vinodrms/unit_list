import {BaseDO} from '../../../../common/base/BaseDO';
import {PriceProductConstraintType, PriceProductConstraintDataDO, IPriceProductConstraint} from '../IPriceProductConstraint';

export class MinimumNumberOfRoomsConstraintDO extends BaseDO implements IPriceProductConstraint {
	noOfRooms: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["noOfRooms"];
	}

	public appliesOn(data: PriceProductConstraintDataDO): boolean {
		// TODO: apply constraint
		return true;
	}
}