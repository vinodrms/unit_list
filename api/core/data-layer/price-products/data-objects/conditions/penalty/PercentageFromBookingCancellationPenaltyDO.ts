import {BaseDO} from '../../../../common/base/BaseDO';
import {IPriceProductCancellationPenalty, PriceProductCancellationPenaltyQueryDO} from './IPriceProductCancellationPenalty';
import {NumberValidationRule} from '../../../../../utils/th-validation/rules/NumberValidationRule';

export class PercentageFromBookingCancellationPenaltyDO extends BaseDO implements IPriceProductCancellationPenalty {
	percentage: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["percentage"];
	}

	public hasCancellationPenalty(): boolean {
		return true;
	}
	public getPenaltyPriceFor(query: PriceProductCancellationPenaltyQueryDO): number {
		return query.totalPrice * this.percentage;
	}
	public isValid(): boolean {
		var rule = NumberValidationRule.buildPercentageNumberRule();
		return rule.validate(this.percentage).isValid();
	}
}