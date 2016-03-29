import {BaseDO} from '../../../../common/base/BaseDO';
import {IPriceProductCancellationPenalty, PriceProductCancellationPenaltyQueryDO} from './IPriceProductCancellationPenalty';

export class FullStayCancellationPenaltyDO extends BaseDO implements IPriceProductCancellationPenalty {
	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}

	public hasCancellationPenalty(): boolean {
		return true;
	}
	public getPenaltyPriceFor(query: PriceProductCancellationPenaltyQueryDO): number {
		return query.totalPrice;
	}
	public isValid(): boolean {
		return true;
	}
}