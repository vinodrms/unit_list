import {BaseDO} from '../../../../common/base/BaseDO';
import {IPriceProductCancellationPenalty} from './IPriceProductCancellationPenalty';
import {ThTranslation} from '../../../../../utils/localization/ThTranslation';
import {BookingPriceDO, BookingPriceType} from '../../../../bookings/data-objects/price/BookingPriceDO';

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
		var penaltyPrice = new BookingPriceDO();
		penaltyPrice.priceType = BookingPriceType.Penalty;
		penaltyPrice.pricePerItem = bookingPrice.pricePerItem;
		penaltyPrice.numberOfItems = 1;
		penaltyPrice.totalPrice = penaltyPrice.pricePerItem;
		penaltyPrice.breakfast = bookingPrice.breakfast;
		penaltyPrice.includedInvoiceItemList = bookingPrice.includedInvoiceItemList;
		return penaltyPrice;
	}
}