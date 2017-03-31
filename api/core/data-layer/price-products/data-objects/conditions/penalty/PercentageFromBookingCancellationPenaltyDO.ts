import { BaseDO } from '../../../../common/base/BaseDO';
import { IPriceProductCancellationPenalty } from './IPriceProductCancellationPenalty';
import { NumberValidationRule } from '../../../../../utils/th-validation/rules/NumberValidationRule';
import { ThTranslation } from '../../../../../utils/localization/ThTranslation';
import { BookingPriceDO, BookingPriceType } from '../../../../bookings/data-objects/price/BookingPriceDO';
import { PenaltyUtils } from './utils/PenaltyUtils';

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
		var penaltyPriceToPay = bookingPrice.totalBookingPriceWithoutDeductedCommission * this.percentage;
		var penaltyUtils = new PenaltyUtils();
		return penaltyUtils.getPenaltyPrice(bookingPrice, penaltyPriceToPay);
	}
}