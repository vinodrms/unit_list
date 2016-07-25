import {BaseDO} from '../../../../common/base/BaseDO';
import {ThTranslation} from '../../../../../utils/localization/ThTranslation';
import {PriceProductConstraintType, PriceProductConstraintDataDO, IPriceProductConstraint} from '../IPriceProductConstraint';
import {ConstraintUtils} from './utils/ConstraintUtils';

export class MinimumLeadDaysConstraintDO extends BaseDO implements IPriceProductConstraint {
	leadDays: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["leadDays"];
	}

	public appliesOn(data: PriceProductConstraintDataDO): boolean {
		var noLeadDaysOfBooking = data.indexedBookingInterval.getNoLeadDays(data.bookingCreationDate);
		return this.leadDays <= noLeadDaysOfBooking;
	}

	public getValueDisplayString(thTranslation: ThTranslation): string {
		return thTranslation.translate("Bookable until %leadDays% days prior to arrival", { leadDays: this.leadDays});
	}
}