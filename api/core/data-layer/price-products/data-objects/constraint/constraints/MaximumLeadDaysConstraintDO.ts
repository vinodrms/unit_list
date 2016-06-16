import {BaseDO} from '../../../../common/base/BaseDO';
import {PriceProductConstraintType, PriceProductConstraintDataDO, IPriceProductConstraint} from '../IPriceProductConstraint';

export class MaximumLeadDaysConstraintDO extends BaseDO implements IPriceProductConstraint {
	leadDays: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["leadDays"];
	}

	public appliesOn(data: PriceProductConstraintDataDO): boolean {
		var noLeadDaysOfBooking = data.indexedBookingInterval.getNoLeadDays(data.currentHotelThDate);
		return this.leadDays >= noLeadDaysOfBooking;
	}
}