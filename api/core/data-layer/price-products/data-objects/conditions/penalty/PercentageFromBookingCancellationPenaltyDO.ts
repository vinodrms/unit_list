import {BaseDO} from '../../../../common/base/BaseDO';
import {IPriceProductCancellationPenalty} from './IPriceProductCancellationPenalty';
import {NumberValidationRule} from '../../../../../utils/th-validation/rules/NumberValidationRule';
import {ThTranslation} from '../../../../../utils/localization/ThTranslation';
import {BookingPriceDO, BookingPriceType} from '../../../../bookings/data-objects/price/BookingPriceDO';

export class PercentageFromBookingCancellationPenaltyDO extends BaseDO implements IPriceProductCancellationPenalty {
	percentage: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["percentage"];
	}

	public hasCancellationPenalty(): boolean {
		return true;
	}
	public isValid(): boolean {
		var rule = NumberValidationRule.buildPercentageNumberRule();
		return rule.validate(this.percentage).isValid();
	}
	public getValueDisplayString(thTranslation: ThTranslation): string {
		return thTranslation.translate("Pay %percentage% % from booking", { percentage: this.percentage * 100 });
	}
	public computePenaltyPrice(bookingPrice: BookingPriceDO): BookingPriceDO {
		var penaltyPrice = new BookingPriceDO();
		penaltyPrice.priceType = BookingPriceType.Penalty;
		penaltyPrice.pricePerItem = bookingPrice.totalPrice * this.percentage;
		penaltyPrice.numberOfItems = 1;
		penaltyPrice.totalPrice = penaltyPrice.pricePerItem;
		penaltyPrice.breakfast = bookingPrice.breakfast;
		penaltyPrice.includedInvoiceItemList = bookingPrice.includedInvoiceItemList;
		return penaltyPrice;
	}
}