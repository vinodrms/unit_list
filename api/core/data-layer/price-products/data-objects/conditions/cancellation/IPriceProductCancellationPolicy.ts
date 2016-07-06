import {BaseDO} from '../../../../common/base/BaseDO';
import {ThDateDO} from '../../../../../utils/th-dates/data-objects/ThDateDO';
import {BookingCancellationTimeDO} from '../../../../bookings/data-objects/cancellation-time/BookingCancellationTimeDO';
import {ThTranslation} from '../../../../../utils/localization/ThTranslation';

export enum PriceProductCancellationPolicyType {
	NoPolicy,
	NoCancellationPossible,
	CanCancelDaysBefore,
	CanCancelBeforeTimeOnDayOfArrival
}

export interface IPriceProductCancellationPolicy extends BaseDO {
	hasCancellationPolicy(): boolean;
	isValid(): boolean;
	generateBookingCancellationTimeDO(arrivalDate: ThDateDO, currentHotelDate: ThDateDO): BookingCancellationTimeDO;
	getValueDisplayString(thTranslation: ThTranslation): string;
}