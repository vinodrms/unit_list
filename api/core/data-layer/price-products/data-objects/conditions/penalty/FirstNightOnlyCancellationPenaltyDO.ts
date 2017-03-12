import { BaseDO } from '../../../../common/base/BaseDO';
import { IPriceProductCancellationPenalty } from './IPriceProductCancellationPenalty';
import { ThTranslation } from '../../../../../utils/localization/ThTranslation';
import { BookingPriceDO, BookingPriceType } from '../../../../bookings/data-objects/price/BookingPriceDO';
import { PenaltyUtils } from './utils/PenaltyUtils';

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
		var roomPriceForFirstNight = bookingPrice.roomPricePerNightAvg;
		if (bookingPrice.roomPricePerNightList.length > 0) {
			roomPriceForFirstNight = bookingPrice.roomPricePerNightList[0].price;
		}

		var totalOtherPriceForFirstNight = 0.0;
		if (bookingPrice.numberOfNights > 0) {
			totalOtherPriceForFirstNight = bookingPrice.totalOtherPrice / bookingPrice.numberOfNights;
		}

		let penaltyPriceToPay = roomPriceForFirstNight + totalOtherPriceForFirstNight;

		var penaltyUtils = new PenaltyUtils();
		return penaltyUtils.getPenaltyPrice(bookingPrice, penaltyPriceToPay);
	}
}