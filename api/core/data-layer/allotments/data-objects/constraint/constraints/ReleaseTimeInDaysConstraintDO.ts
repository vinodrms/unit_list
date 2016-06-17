import {BaseDO} from '../../../../common/base/BaseDO';
import {IAllotmentConstraint, AllotmentConstraintDataDO} from '../IAllotmentConstraint';

export class ReleaseTimeInDaysConstraintDO extends BaseDO implements IAllotmentConstraint {
	noOfDays: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["noOfDays"];
	}

	public appliesOn(data: AllotmentConstraintDataDO): boolean {
		var noLeadDaysOfBooking = data.indexedBookingInterval.getNoLeadDays(data.currentHotelThDate);
		return this.noOfDays <= noLeadDaysOfBooking;
	}
}