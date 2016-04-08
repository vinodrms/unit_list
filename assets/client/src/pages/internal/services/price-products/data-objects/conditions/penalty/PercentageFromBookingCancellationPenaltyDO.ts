import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {IPriceProductCancellationPenalty} from './IPriceProductCancellationPenalty';

export class PercentageFromBookingCancellationPenaltyDO extends BaseDO implements IPriceProductCancellationPenalty {
	percentage: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["percentage"];
	}

	public hasCancellationPenalty(): boolean {
		return true;
	}

	public isValid(): boolean {
		if (_.isNumber(this.percentage) && this.percentage >= 0 && this.percentage <= 1) {
			return true;
		}
		return false;
	}
}