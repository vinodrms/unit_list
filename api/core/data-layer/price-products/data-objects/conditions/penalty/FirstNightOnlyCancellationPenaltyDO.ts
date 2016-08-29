import {BaseDO} from '../../../../common/base/BaseDO';
import {IPriceProductCancellationPenalty} from './IPriceProductCancellationPenalty';
import {ThTranslation} from '../../../../../utils/localization/ThTranslation';
import {BookingPriceDO, BookingPriceType} from '../../../../bookings/data-objects/price/BookingPriceDO';
import {PenaltyUtils} from './utils/PenaltyUtils';

export class FirstNightOnlyCancellationPenaltyDO extends BaseDO implements IPriceProductCancellationPenalty {
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
		return thTranslation.translate("Pay first night");
	}
	public computePenaltyPrice(bookingPrice: BookingPriceDO): BookingPriceDO {
		var penaltyPriceToPay = 0.0;
		if (bookingPrice.numberOfNights > 0) {
			penaltyPriceToPay = bookingPrice.totalBookingPrice / bookingPrice.numberOfNights;
		}
		var penaltyUtils = new PenaltyUtils();
		return penaltyUtils.getPenaltyPrice(bookingPrice, penaltyPriceToPay);
	}
}