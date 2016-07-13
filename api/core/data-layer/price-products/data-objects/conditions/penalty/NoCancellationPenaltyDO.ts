import {BaseDO} from '../../../../common/base/BaseDO';
import {IPriceProductCancellationPenalty} from './IPriceProductCancellationPenalty';
import {ThTranslation} from '../../../../../utils/localization/ThTranslation';
import {BookingPriceDO} from '../../../../bookings/data-objects/price/BookingPriceDO';

export class NoCancellationPenaltyDO extends BaseDO implements IPriceProductCancellationPenalty {
	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}

	public hasCancellationPenalty(): boolean {
		return false;
	}
	public isValid(): boolean {
		return true;
	}
	public getValueDisplayString(thTranslation: ThTranslation): string {
		return thTranslation.translate("No penalty");
	}
	public computePenaltyPrice(bookingPrice: BookingPriceDO): BookingPriceDO {
		return bookingPrice;
	}
}