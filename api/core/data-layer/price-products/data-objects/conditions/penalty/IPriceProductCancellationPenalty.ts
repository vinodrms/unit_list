import {BaseDO} from '../../../../common/base/BaseDO';
import {ThTranslation} from '../../../../../utils/localization/ThTranslation';
import {BookingPriceDO} from '../../../../bookings/data-objects/price/BookingPriceDO';

export enum PriceProductCancellationPenaltyType {
	NoPenalty,
	FullStay,
	FirstNightOnly,
	PercentageFromBooking
}

export interface IPriceProductCancellationPenalty extends BaseDO {
	hasCancellationPenalty(): boolean;
	isValid(): boolean;
	getValueDisplayString(thTranslation: ThTranslation): string;
	computePenaltyPrice(bookingPrice: BookingPriceDO): BookingPriceDO;
}