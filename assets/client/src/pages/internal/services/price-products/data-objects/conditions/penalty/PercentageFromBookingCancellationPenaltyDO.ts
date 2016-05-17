import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {IPriceProductCancellationPenalty, CancellationPenaltyDescription} from './IPriceProductCancellationPenalty';

export class PercentageFromBookingCancellationPenaltyDO extends BaseDO implements IPriceProductCancellationPenalty {
	percentage: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["percentage"];
	}
	public getDescription(): CancellationPenaltyDescription {
		return {
			phrase: "Pay %percentage% from whole booking",
			parameters: {
				percentage: Math.round(this.percentage * 100) + "%" 
			} 
		}
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