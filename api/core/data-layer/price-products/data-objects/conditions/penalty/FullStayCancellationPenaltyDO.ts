import {BaseDO} from '../../../../common/base/BaseDO';
import {ThTranslation} from '../../../../../utils/localization/ThTranslation';
import {IPriceProductCancellationPenalty} from './IPriceProductCancellationPenalty';
import {BookingPriceDO, BookingPriceType} from '../../../../bookings/data-objects/price/BookingPriceDO';

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
		var penaltyPrice = new BookingPriceDO();
		penaltyPrice.priceType = BookingPriceType.Penalty;
		penaltyPrice.pricePerItem = bookingPrice.pricePerItem;
		penaltyPrice.numberOfItems = bookingPrice.numberOfItems;
		penaltyPrice.totalPrice = bookingPrice.totalPrice;
		penaltyPrice.breakfast = bookingPrice.breakfast;
		penaltyPrice.includedInvoiceItemList = bookingPrice.includedInvoiceItemList;
		return penaltyPrice;
	}
}