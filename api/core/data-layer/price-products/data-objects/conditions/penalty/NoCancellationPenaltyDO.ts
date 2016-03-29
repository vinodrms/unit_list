import {BaseDO} from '../../../../common/base/BaseDO';
import {IPriceProductCancellationPenalty, PriceProductCancellationPenaltyQueryDO} from './IPriceProductCancellationPenalty';

export class NoCancellationPenaltyDO extends BaseDO implements IPriceProductCancellationPenalty {
	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}

	public hasCancellationPenalty(): boolean {
		return false;
	}
	public getPenaltyPriceFor(query: PriceProductCancellationPenaltyQueryDO) {
		return 0.0;
	}
	public isValid(): boolean {
		return true;
	}
}