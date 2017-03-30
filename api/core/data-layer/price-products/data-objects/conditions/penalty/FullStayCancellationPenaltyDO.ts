import { BaseDO } from '../../../../common/base/BaseDO';
import { ThTranslation } from '../../../../../utils/localization/ThTranslation';
import { IPriceProductCancellationPenalty } from './IPriceProductCancellationPenalty';
import { BookingPriceDO, BookingPriceType } from '../../../../bookings/data-objects/price/BookingPriceDO';
import { PenaltyUtils } from './utils/PenaltyUtils';

export class FullStayCancellationPenaltyDO extends BaseDO implements IPriceProductCancellationPenalty {
	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}

	public hasCancellationPenalty(): boolean {
		return true;
	}
	public isValid(): boolean {
		return true;
	}
	public getValueDisplayString(thTranslation: ThTranslation): string {
		return thTranslation.translate("Pay full stay");
	}
	public computePenaltyPrice(bookingPrice: BookingPriceDO): BookingPriceDO {
		var penaltyUtils = new PenaltyUtils();
		return penaltyUtils.getPenaltyPrice(bookingPrice, bookingPrice.totalBookingPriceWithoutDeductedCommission);
	}
}