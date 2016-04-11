import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {IPriceProductCancellationPenalty, CancellationPenaltyDescription} from './IPriceProductCancellationPenalty';

export class NoCancellationPenaltyDO extends BaseDO implements IPriceProductCancellationPenalty {
	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}
	public getDescription(): CancellationPenaltyDescription {
		return {
			phrase: "No cancellation penalty"
		}
	}
	public hasCancellationPenalty(): boolean {
		return false;
	}

	public isValid(): boolean {
		return true;
	}
}