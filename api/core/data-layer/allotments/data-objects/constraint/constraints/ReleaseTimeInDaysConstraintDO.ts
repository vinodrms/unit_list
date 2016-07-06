import {BaseDO} from '../../../../common/base/BaseDO';
import {ThTranslation} from '../../../../../utils/localization/ThTranslation';
import {IAllotmentConstraint, AllotmentConstraintDataDO} from '../IAllotmentConstraint';

export class ReleaseTimeInDaysConstraintDO extends BaseDO implements IAllotmentConstraint {
	noOfDays: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["noOfDays"];
	}

	public appliesOn(data: AllotmentConstraintDataDO): boolean {
		var noLeadDaysOfBooking = data.indexedBookingInterval.getNoLeadDays(data.currentHotelThDate);
		return this.noOfDays < noLeadDaysOfBooking;
	}
	public getValueDisplayString(thTranslation: ThTranslation): string {
		return thTranslation.translate("%noOfDays% days release", { leadDays: this.noOfDays });
	}
}