import {BaseDO} from '../../../../common/base/BaseDO';
import {IPriceProductCancellationPolicy} from './IPriceProductCancellationPolicy';
import {CancellationPolicyUtils} from './utils/CancellationPolicyUtils';
import {ThDateDO} from '../../../../../utils/th-dates/data-objects/ThDateDO';
import {ThHourDO} from '../../../../../utils/th-dates/data-objects/ThHourDO';
import {BookingCancellationTimeDO, BookingCancellationTimeType} from '../../../../bookings/data-objects/cancellation-time/BookingCancellationTimeDO';

export class NoCancellationPolicyDO extends BaseDO implements IPriceProductCancellationPolicy {
	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}

	public hasCancellationPolicy(): boolean {
		return false;
	}
	public isValid(): boolean {
		return true;
	}
	public generateBookingCancellationTimeDO(arrivalDate: ThDateDO, currentHotelDate: ThDateDO): BookingCancellationTimeDO {
		var ccUtils = new CancellationPolicyUtils();
		return ccUtils.generateBookingCancellationTimeDO(BookingCancellationTimeType.DependentOnCancellationHour, arrivalDate, ThHourDO.buildThHourDO(0, 0));
	}
}